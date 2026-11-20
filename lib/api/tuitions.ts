import type {
  PublicTuitionDetails,
  TuitionSearchResponse,
} from "@/lib/types/tuition"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

export async function getPublicTuitions(
  query: string
): Promise<TuitionSearchResponse> {
  const search = query ? `?${query}` : ""
  const response = await fetch(`${API_BASE_URL}/api/tuitions${search}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Tuitions request failed with status ${response.status}.`)
  }

  return response.json() as Promise<TuitionSearchResponse>
}

export async function getPublicTuition(
  id: string
): Promise<PublicTuitionDetails | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `Tuition details request failed with status ${response.status}.`
    )
  }

  return response.json() as Promise<PublicTuitionDetails>
}
