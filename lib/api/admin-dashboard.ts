export type AdminDashboardSummary = {
  totalUsers: number
  totalTutors: number
  pendingTuitions: number
  approvedTuitions: number
  revenue: {
    currency: string
    amountMinor: number
    paymentCount: number
  }[]
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isAdminDashboardSummary(
  value: unknown
): value is AdminDashboardSummary {
  const isRevenueTotal = (total: unknown) =>
    isRecord(total) &&
    typeof total.currency === "string" &&
    /^[a-z]{3}$/i.test(total.currency) &&
    typeof total.amountMinor === "number" &&
    Number.isSafeInteger(total.amountMinor) &&
    total.amountMinor >= 0 &&
    typeof total.paymentCount === "number" &&
    Number.isSafeInteger(total.paymentCount) &&
    total.paymentCount > 0

  return (
    isRecord(value) &&
    Number.isSafeInteger(value.totalUsers) &&
    Number.isSafeInteger(value.totalTutors) &&
    Number.isSafeInteger(value.pendingTuitions) &&
    Number.isSafeInteger(value.approvedTuitions) &&
    Array.isArray(value.revenue) &&
    value.revenue.every(isRevenueTotal)
  )
}

export async function getAdminDashboard(
  token: string
): Promise<AdminDashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })

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

  if (!isAdminDashboardSummary(payload)) {
    throw new Error("The server returned an invalid admin dashboard summary.")
  }

  return payload
}
