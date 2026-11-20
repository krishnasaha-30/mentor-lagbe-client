export type PublicStats = {
  tutors: number
  activeTuitions: number
  subjects: number
  acceptedApplications: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPublicStats(value: unknown): value is PublicStats {
  return (
    isRecord(value) &&
    Number.isSafeInteger(value.tutors) &&
    Number.isSafeInteger(value.activeTuitions) &&
    Number.isSafeInteger(value.subjects) &&
    Number.isSafeInteger(value.acceptedApplications)
  )
}

export async function getPublicStats(): Promise<PublicStats> {
  const response = await fetch(`${API_BASE_URL}/api/public/stats`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Platform statistics request failed with status ${response.status}.`
    )
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error(
      "The server returned an invalid platform statistics response."
    )
  }

  if (!isPublicStats(payload)) {
    throw new Error("The server returned invalid platform statistics.")
  }

  return payload
}
