import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

export type NewApplicationInput = {
  phone: string
  preferredSchedule: string
  note: string
}

export type MyApplication = {
  id: string
  status: "pending" | "accepted" | "rejected"
  phone: string
  preferredSchedule: string
  note: string
  createdAt: string
  tuition: {
    id: string
    title: string
    subject: string
    classLevel: string
    monthlyFee: number
    isPublic: boolean
    tutor: { name: string; email?: string | null; image: string | null } | null
  } | null
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isMyApplication(value: unknown): value is MyApplication {
  if (!isRecord(value)) return false

  const tuition = value.tuition
  const validTutor =
    tuition === null ||
    (isRecord(tuition) &&
      (tuition.tutor === null ||
        (isRecord(tuition.tutor) &&
          typeof tuition.tutor.name === "string" &&
          (typeof tuition.tutor.image === "string" ||
            tuition.tutor.image === null))))
  const validTuition =
    tuition === null ||
    (isRecord(tuition) &&
      typeof tuition.id === "string" &&
      typeof tuition.title === "string" &&
      typeof tuition.subject === "string" &&
      typeof tuition.classLevel === "string" &&
      typeof tuition.monthlyFee === "number" &&
      typeof tuition.isPublic === "boolean" &&
      validTutor)

  return (
    typeof value.id === "string" &&
    (value.status === "pending" ||
      value.status === "accepted" ||
      value.status === "rejected") &&
    typeof value.phone === "string" &&
    typeof value.preferredSchedule === "string" &&
    typeof value.note === "string" &&
    typeof value.createdAt === "string" &&
    validTuition
  )
}

export async function createApplication(
  tuitionId: string,
  application: NewApplicationInput,
  token: string
) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(tuitionId)}/applications`,
    token,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(application),
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

export async function getMyApplications(token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/applications/mine`,
    token
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
    !Array.isArray(payload.applications) ||
    !payload.applications.every(isMyApplication)
  ) {
    throw new Error("The server returned an invalid application list.")
  }

  return payload.applications
}

export async function cancelApplication(id: string, token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/applications/${encodeURIComponent(id)}`,
    token,
    {
      method: "DELETE",
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

  if (!isRecord(payload) || payload.id !== id || payload.cancelled !== true) {
    throw new Error("The server did not confirm application cancellation.")
  }
}
