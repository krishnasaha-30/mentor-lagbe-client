import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

export type BillingPlan = "pro_tutor" | "pro_student"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

async function getBillingUrl(response: Response) {
  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error("The server returned an invalid billing response.")
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : "Unable to open Stripe billing."
    throw new Error(message)
  }

  if (!isRecord(payload) || typeof payload.url !== "string") {
    throw new Error("The server did not return a Stripe URL.")
  }

  return payload.url
}

export async function createCheckoutSession(plan: BillingPlan, token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/billing/checkout`,
    token,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    }
  )

  return getBillingUrl(response)
}

export async function createBillingPortalSession(token: string) {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/billing/portal`,
    token,
    { method: "POST" }
  )

  return getBillingUrl(response)
}

export async function verifyCheckoutSession(
  sessionId: string,
  token: string
): Promise<BillingPlan> {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/billing/checkout/verify`,
    token,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }
  )

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error(
      "The server returned an invalid payment verification response."
    )
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : "Unable to verify your payment."
    throw new Error(message)
  }

  if (
    !isRecord(payload) ||
    payload.verified !== true ||
    (payload.plan !== "pro_tutor" && payload.plan !== "pro_student")
  ) {
    throw new Error(
      "The server returned an invalid payment verification response."
    )
  }

  return payload.plan
}
