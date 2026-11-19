import type { TuitionSearchResponse } from "@/lib/types/tuition"

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
