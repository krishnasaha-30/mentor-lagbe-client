"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  cancelApplication,
  getMyApplications,
  type MyApplication,
} from "@/lib/api/applications"
import { authClient } from "@/lib/auth-client"

type ApplicationsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; applications: MyApplication[] }

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Date unavailable"

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date)
}

function formatFee(value: number) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value)}`
}

export function MyApplications() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [state, setState] = useState<ApplicationsState>({ status: "loading" })
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getMyApplications(token)
      .then((applications) => {
        if (!cancelled) {
          setState({ status: "ready", applications })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Could not load your applications.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  async function handleCancel(id: string) {
    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    setCancellingId(id)

    try {
      await cancelApplication(id, token)
      setState((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              applications: current.applications.filter(
                (application) => application.id !== id
              ),
            }
          : current
      )
      toast.success("Application cancelled.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not cancel this application."
      )
    } finally {
      setCancellingId(null)
    }
  }

  function refreshApplications() {
    setState({ status: "loading" })
    setRefreshKey((value) => value + 1)
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink">
            My Applications
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Track your tuition applications and their latest decisions.
          </p>
        </div>
        {state.status === "error" ? (
          <button
            type="button"
            onClick={refreshApplications}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-forest hover:bg-cream-soft"
          >
            Try again
          </button>
        ) : null}
      </div>

      {sessionPending || state.status === "loading" ? (
        <div
          role="status"
          className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-sm text-ink-soft"
        >
          Loading your applications...
        </div>
      ) : !token ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
        >
          Your session has expired. Please sign in again.
        </div>
      ) : state.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
        >
          {state.message}
        </div>
      ) : state.applications.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-white px-6 py-14 text-center">
          <h3 className="font-display text-xl font-bold text-ink">
            No applications yet
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            Browse available tuitions and apply to find your next tutor.
          </p>
          <Link
            href="/tuitions"
            className="mt-5 inline-flex rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-ink hover:bg-coral-dark"
          >
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <DataTable
          columns={[
            "Tuition",
            "Tutor",
            "Status",
            "Preferred schedule",
            "Applied",
            "Actions",
          ]}
          className="max-w-full"
        >
          {state.applications.map((application) => (
            <DataRow key={application.id}>
              <td className="px-6 py-4">
                {application.tuition?.isPublic ? (
                  <Link
                    href={`/tuitions/${encodeURIComponent(application.tuition.id)}`}
                    className="font-semibold text-ink hover:text-forest hover:underline"
                  >
                    {application.tuition.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink">
                    {application.tuition?.title ?? "Tuition unavailable"}
                  </span>
                )}
                {application.tuition ? (
                  <p className="mt-1 text-xs text-ink-soft">
                    {application.tuition.subject} ·{" "}
                    {application.tuition.classLevel} ·{" "}
                    {formatFee(application.tuition.monthlyFee)}/mo
                  </p>
                ) : null}
              </td>
              <td className="px-6 py-4">
                {application.tuition?.tutor ? (
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      name={application.tuition.tutor.name}
                      image={application.tuition.tutor.image}
                      size="sm"
                    />
                    <span className="max-w-36 truncate">
                      {application.tuition.tutor.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-ink-soft">Unavailable</span>
                )}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={application.status} />
              </td>
              <td className="px-6 py-4 text-ink-soft">
                <span>{application.preferredSchedule}</span>
                {application.note ? (
                  <p className="mt-1 max-w-48 truncate text-xs">
                    {application.note}
                  </p>
                ) : null}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-ink-soft">
                {formatDate(application.createdAt)}
              </td>
              <td className="px-6 py-4">
                {application.status === "pending" ? (
                  <button
                    type="button"
                    onClick={() => handleCancel(application.id)}
                    disabled={cancellingId !== null}
                    className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-stat-peach disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancellingId === application.id
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                ) : (
                  <span className="text-xs text-ink-soft">—</span>
                )}
              </td>
            </DataRow>
          ))}
        </DataTable>
      )}
    </div>
  )
}
