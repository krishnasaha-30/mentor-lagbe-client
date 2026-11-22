import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

export type TuitionReview = {
  id: string
  studentName: string
  studentImage: string | null
  rating: number
  feedback: string
  createdAt: string
}

export type TuitionReviewsResponse = {
  reviews: TuitionReview[]
  totalReviews: number
  averageRating: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

export async function getTuitionReviews(
  tuitionId: string
): Promise<TuitionReviewsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/tuitions/${encodeURIComponent(tuitionId)}/reviews`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return { reviews: [], totalReviews: 0, averageRating: 0 }
  }

  return res.json()
}

export async function submitTuitionReview(
  tuitionId: string,
  data: { rating: number; feedback: string },
  token: string
) {
  const res = await fetchWithAccessToken(
    `${API_BASE_URL}/api/tuitions/${encodeURIComponent(tuitionId)}/reviews`,
    token,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    }
  )

  const payload = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(payload.message ?? "Could not submit review.")
  }

  return payload
}
