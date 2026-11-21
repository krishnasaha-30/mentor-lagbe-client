"use client"

import { Receipt, RotateCw } from "lucide-react"
import { useEffect, useState } from "react"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { TableSkeleton } from "@/components/dashboard/table-skeleton"
import { Button } from "@/components/ui/button"
import {
  getAdminTransactions,
  type AdminTransaction,
} from "@/lib/api/admin-transactions"
import { authClient } from "@/lib/auth-client"
import { formatMinorCurrencyAmount } from "@/lib/format-currency"

type TransactionListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; transactions: AdminTransaction[] }

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function AdminTransactions() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [list, setList] = useState<TransactionListState>({ status: "loading" })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getAdminTransactions(token)
      .then((transactions) => {
        if (!cancelled) setList({ status: "ready", transactions })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setList({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Could not load transactions.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  function refreshTransactions() {
    setList({ status: "loading" })
    setRefreshKey((value) => value + 1)
  }

  if (!sessionPending && !token) {
    return (
      <div
        role="alert"
        className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
      >
        Your session has expired. Please sign in again.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {list.status === "ready"
            ? `${list.transactions.length} paid ${
                list.transactions.length === 1 ? "invoice" : "invoices"
              }`
            : "Billing history"}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={refreshTransactions}
          disabled={list.status === "loading" || sessionPending}
          className="h-10 gap-2 rounded-full border-line bg-white px-4 text-ink"
        >
          <RotateCw aria-hidden="true" className="size-4" />
          Refresh
        </Button>
      </div>

      {sessionPending || list.status === "loading" ? (
        <TableSkeleton columns={6} />
      ) : list.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <p className="text-sm text-ink">{list.message}</p>
          <button
            type="button"
            onClick={refreshTransactions}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest hover:bg-cream-soft"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </button>
        </div>
      ) : list.transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Paid Stripe invoices will appear here once a subscription is purchased."
        />
      ) : (
        <DataTable
          columns={["Name", "Email", "Plan", "Amount", "Date", "Invoice"]}
        >
          {list.transactions.map((transaction) => (
            <DataRow key={transaction.id}>
              <td className="px-5 py-4 font-medium text-ink sm:px-6">
                {transaction.customer?.name || "Account unavailable"}
              </td>
              <td className="px-5 py-4 text-ink-soft sm:px-6">
                {transaction.customer?.email ?? "—"}
              </td>
              <td className="px-5 py-4 text-ink-soft sm:px-6">
                {transaction.plan === "pro_tutor" ? "Pro Tutor" : "Pro Student"}
              </td>
              <td className="px-5 py-4 font-semibold whitespace-nowrap text-ink sm:px-6">
                {formatMinorCurrencyAmount(
                  transaction.amountMinor,
                  transaction.currency
                )}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-ink-soft sm:px-6">
                {formatDate(transaction.createdAt)}
              </td>
              <td className="px-5 py-4 sm:px-6">
                {transaction.invoiceUrl ? (
                  <a
                    href={transaction.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-forest underline-offset-4 hover:underline"
                  >
                    View invoice
                  </a>
                ) : (
                  <span className="text-ink-soft">—</span>
                )}
              </td>
            </DataRow>
          ))}
        </DataTable>
      )}
    </div>
  )
}
