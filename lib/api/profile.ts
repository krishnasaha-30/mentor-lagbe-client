import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

export type UserProfile = {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  role: "student" | "tutor" | "admin"
  image: string | null
}

export type ProfileUpdate = Pick<
  UserProfile,
  "name" | "phone" | "bio" | "image"
>

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isUserProfile(value: unknown): value is UserProfile {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    typeof value.bio === "string" &&
    (value.role === "student" ||
      value.role === "tutor" ||
      value.role === "admin") &&
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

export async function getMyProfile(token: string): Promise<UserProfile> {
  const response = await fetchWithAccessToken(`${API_BASE_URL}/api/me`, token)
  const payload = await readResponse(response)

  if (!isUserProfile(payload)) {
    throw new Error("The server returned an invalid profile.")
  }

  return payload
}

export async function uploadProfileImage(file: File, token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/me/image`,
    token,
    {
      method: "POST",
      headers: { "content-type": file.type },
      body: file,
    }
  )
  const payload = await readResponse(response)

  if (
    typeof payload.url !== "string" ||
    !payload.url.startsWith("https://i.ibb.co/")
  ) {
    throw new Error("The image service returned an invalid URL.")
  }

  return payload.url
}

export async function updateMyProfile(
  profile: ProfileUpdate,
  token: string
): Promise<UserProfile> {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/me/profile`,
    token,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(profile),
    }
  )
  const payload = await readResponse(response)

  if (!isUserProfile(payload)) {
    throw new Error("The server returned an invalid updated profile.")
  }

  return payload
}
