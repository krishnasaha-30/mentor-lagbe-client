import type {
  AdminTuitionApproval,
  PendingTuition,
} from "@/lib/types/admin-tuition"
import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPendingTuition(value: unknown): value is PendingTuition {
  if (!isRecord(value)) return false

  const tutor = value.tutor
  const validTutor =
    tutor === null ||
    (isRecord(tutor) &&
      typeof tutor.name === "string" &&
      typeof tutor.email === "string" &&
      (typeof tutor.image === "string" || tutor.image === null))

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.subject === "string" &&
    typeof value.classLevel === "string" &&
    typeof value.mode === "string" &&
    typeof value.location === "string" &&
    typeof value.monthlyFee === "number" &&
    typeof value.daysPerWeek === "number" &&
    typeof value.description === "string" &&
    (typeof value.bannerImage === "string" || value.bannerImage === null) &&
    typeof value.createdAt === "string" &&
    validTutor
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

export async function getPendingTuitions(token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/admin/tuitions/pending`,
    token
  )
  const payload = await readResponse(response)

  if (
    !Array.isArray(payload.tuitions) ||
    !payload.tuitions.every(isPendingTuition)
  ) {
    throw new Error("The server returned an invalid tuition approval list.")
  }

  return payload.tuitions
}

export async function updateTuitionApproval(
  id: string,
  approvalStatus: AdminTuitionApproval,
  token: string
) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/admin/tuitions/${encodeURIComponent(id)}/approval`,
    token,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ approvalStatus }),
    }
  )
  const payload = await readResponse(response)

  if (payload.id !== id || payload.approvalStatus !== approvalStatus) {
    throw new Error("The server did not confirm the approval update.")
  }
}
