import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: "student" | "tutor"
  plan: "free" | "pro"
  image: string | null
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isAdminUser(value: unknown): value is AdminUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    (value.role === "student" || value.role === "tutor") &&
    (value.plan === "free" || value.plan === "pro") &&
    (typeof value.image === "string" || value.image === null)
  )
}

async function readResponse(response: Response) {
  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error(`Request failed with status ${response.status}.`)
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}.`
    throw new Error(message)
  }

  if (!isRecord(payload)) {
    throw new Error("The server returned an invalid response.")
  }

  return payload
}

export async function getAdminUsers(token: string): Promise<AdminUser[]> {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/admin/users`,
    token
  )
  const payload = await readResponse(response)

  if (!Array.isArray(payload.users) || !payload.users.every(isAdminUser)) {
    throw new Error("The server returned an invalid user list.")
  }

  return payload.users
}

export async function updateAdminUserRole(
  id: string,
  role: AdminUser["role"],
  token: string
): Promise<void> {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/admin/users/${encodeURIComponent(id)}/role`,
    token,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  )
  const payload = await readResponse(response)

  if (payload.id !== id || payload.role !== role) {
    throw new Error("The server did not confirm the role update.")
  }
}
