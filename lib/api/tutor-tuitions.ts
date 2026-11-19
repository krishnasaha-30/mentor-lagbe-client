import type { NewTuitionInput } from "@/lib/types/tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
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

export async function uploadTuitionBanner(file: File, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/tuitions/banner`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": file.type,
    },
    body: file,
    cache: "no-store",
  })
  const payload = await readResponse(response)

  if (typeof payload.url !== "string") {
    throw new Error("The image service returned an invalid URL.")
  }

  return payload.url
}

export async function createTuition(tuition: NewTuitionInput, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/tuitions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(tuition),
    cache: "no-store",
  })
  const payload = await readResponse(response)

  if (typeof payload.id !== "string") {
    throw new Error("The server did not confirm the tuition submission.")
  }

  return payload.id
}
