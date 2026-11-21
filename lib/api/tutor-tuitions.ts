import type { NewTuitionInput, TutorTuition } from "@/lib/types/tuition"
import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isTutorTuition(value: unknown): value is TutorTuition {
  if (!isRecord(value)) return false

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.subject === "string" &&
    typeof value.classLevel === "string" &&
    (value.mode === "Online" || value.mode === "Offline") &&
    typeof value.location === "string" &&
    typeof value.monthlyFee === "number" &&
    typeof value.daysPerWeek === "number" &&
    typeof value.description === "string" &&
    (typeof value.bannerImage === "string" || value.bannerImage === null) &&
    (value.approvalStatus === "pending" ||
      value.approvalStatus === "approved" ||
      value.approvalStatus === "rejected") &&
    typeof value.isActive === "boolean" &&
    typeof value.createdAt === "string"
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

export async function uploadTuitionBanner(
  file: File,
  token: string,
  tuitionId?: string
) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/banner`,
    token,
    {
      method: "POST",
      headers: {
        "content-type": file.type,
        ...(tuitionId ? { "x-tuition-id": tuitionId } : {}),
      },
      body: file,
    }
  )
  const payload = await readResponse(response)

  if (typeof payload.url !== "string") {
    throw new Error("The image service returned an invalid URL.")
  }

  return payload.url
}

export async function createTuition(tuition: NewTuitionInput, token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions`,
    token,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(tuition),
    }
  )
  const payload = await readResponse(response)

  if (typeof payload.id !== "string") {
    throw new Error("The server did not confirm the tuition submission.")
  }

  return payload.id
}

export async function getMyTuitions(token: string): Promise<TutorTuition[]> {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/mine`,
    token
  )
  const payload = await readResponse(response)

  if (
    !Array.isArray(payload.tuitions) ||
    !payload.tuitions.every(isTutorTuition)
  ) {
    throw new Error("The server returned an invalid tuition list.")
  }

  return payload.tuitions
}

export async function updateTuition(
  id: string,
  tuition: NewTuitionInput,
  token: string
) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(id)}`,
    token,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(tuition),
    }
  )
  const payload = await readResponse(response)

  if (payload.id !== id || payload.approvalStatus !== "pending") {
    throw new Error("The server did not confirm the tuition update.")
  }
}

export async function updateTuitionActivity(
  id: string,
  isActive: boolean,
  token: string
) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(id)}/activity`,
    token,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive }),
    }
  )
  const payload = await readResponse(response)

  if (payload.id !== id || payload.isActive !== isActive) {
    throw new Error("The server did not confirm the tuition status update.")
  }
}

export async function deleteTuition(id: string, token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(id)}`,
    token,
    {
      method: "DELETE",
    }
  )
  const payload = await readResponse(response)

  if (payload.id !== id || payload.deleted !== true) {
    throw new Error("The server did not confirm the tuition deletion.")
  }
}
