import { fetchWithAccessToken } from "@/lib/api/authenticated-fetch"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

export type AdminTransaction = {
  id: string
  plan: "pro_tutor" | "pro_student"
  amountMinor: number
  currency: string
  status: "paid"
  createdAt: string
  invoiceUrl: string | null
  customer: { name: string | null; email: string | null } | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isTransaction(value: unknown): value is AdminTransaction {
  if (!isRecord(value)) return false

  const isCustomer =
    value.customer === null ||
    (isRecord(value.customer) &&
      (typeof value.customer.name === "string" ||
        value.customer.name === null) &&
      (typeof value.customer.email === "string" ||
        value.customer.email === null))

  return (
    typeof value.id === "string" &&
    (value.plan === "pro_tutor" || value.plan === "pro_student") &&
    typeof value.amountMinor === "number" &&
    Number.isSafeInteger(value.amountMinor) &&
    value.amountMinor >= 0 &&
    typeof value.currency === "string" &&
    /^[a-z]{3}$/i.test(value.currency) &&
    value.status === "paid" &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    (typeof value.invoiceUrl === "string" || value.invoiceUrl === null) &&
    isCustomer
  )
}

export async function getAdminTransactions(
  token: string
): Promise<AdminTransaction[]> {
  const response = await fetchWithAccessToken(
    `${API_BASE_URL}/api/admin/transactions`,
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
    !Array.isArray(payload.transactions) ||
    !payload.transactions.every(isTransaction)
  ) {
    throw new Error("The server returned an invalid transactions response.")
  }

  return payload.transactions
}
