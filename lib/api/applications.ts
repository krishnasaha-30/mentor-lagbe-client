export type NewApplicationInput = {
  phone: string
  preferredSchedule: string
  note: string
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export async function createApplication(
  tuitionId: string,
  application: NewApplicationInput,
  token: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(tuitionId)}/applications`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(application),
      cache: "no-store",
    }
  )

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

  if (
    !isRecord(payload) ||
    typeof payload.id !== "string" ||
    payload.tuitionId !== tuitionId ||
    payload.status !== "pending"
  ) {
    throw new Error("The server did not confirm your application.")
  }
}
