"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-forest underline-offset-4 hover:underline"
          >
            Back to dashboard
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-ink">
            Transactions
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Latest 100 paid Stripe invoices. Amounts are gross payments before
            refunds and Stripe fees.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={refreshTransactions}
          disabled={list.status === "loading" || sessionPending}
        >
          Refresh
        </Button>
      </div>

      {sessionPending || list.status === "loading" ? (
        <div
          role="status"
          className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-sm text-ink-soft"
        >
          Loading transactions...
        </div>
      ) : list.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
        >
          {list.message}
        </div>
      ) : (
        <DataTable
          columns={["Customer", "Plan", "Amount", "Date", "Status", "Invoice"]}
          isEmpty={list.transactions.length === 0}
          emptyMessage="No paid Stripe transactions have been recorded yet."
        >
          {list.transactions.map((transaction) => (
            <DataRow key={transaction.id}>
              <td className="px-5 py-4 sm:px-6">
                <p className="font-medium text-ink">
                  {transaction.customer?.name || "Account unavailable"}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  {transaction.customer?.email ?? "—"}
                </p>
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
                <span className="rounded-full bg-stat-mint px-3 py-1 text-xs font-semibold text-forest">
                  Paid
                </span>
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
