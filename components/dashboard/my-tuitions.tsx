"use client"

import Link from "next/link"
import { BookOpen, Plus, RotateCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { TableSkeleton } from "@/components/dashboard/table-skeleton"
import {
  getMyTuitions,
  deleteTuition,
  updateTuitionActivity,
} from "@/lib/api/tutor-tuitions"
import { authClient } from "@/lib/auth-client"
import type { TutorTuition } from "@/lib/types/tuition"

type TuitionListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; tuitions: TutorTuition[] }

function formatFee(value: number) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value)}`
}

export function MyTuitions() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [list, setList] = useState<TuitionListState>({ status: "loading" })
  const [busyId, setBusyId] = useState<string | null>(null)
  const [busyAction, setBusyAction] = useState<"activity" | "delete" | null>(
    null
  )
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getMyTuitions(token)
      .then((tuitions) => {
        if (!cancelled) {
          setList({ status: "ready", tuitions })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setList({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Could not load your tuitions.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  function refreshList() {
    setList({ status: "loading" })
    setRefreshKey((value) => value + 1)
  }

  async function handleActivityChange(tuition: TutorTuition) {
    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    const isActive = !tuition.isActive
    setBusyId(tuition.id)
    setBusyAction("activity")

    try {
      await updateTuitionActivity(tuition.id, isActive, token)
      setList((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              tuitions: current.tuitions.map((item) =>
                item.id === tuition.id ? { ...item, isActive } : item
              ),
            }
          : current
      )
      toast.success(isActive ? "Tuition opened." : "Tuition closed.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the tuition status."
      )
    } finally {
      setBusyId(null)
      setBusyAction(null)
    }
  }

  async function handleDelete(tuition: TutorTuition) {
    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    if (!window.confirm(`Delete "${tuition.title}"? This cannot be undone.`)) {
      return
    }

    setBusyId(tuition.id)
    setBusyAction("delete")

    try {
      await deleteTuition(tuition.id, token)
      setList((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              tuitions: current.tuitions.filter(
                (item) => item.id !== tuition.id
              ),
            }
          : current
      )
      toast.success("Tuition deleted.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete this tuition."
      )
    } finally {
      setBusyId(null)
      setBusyAction(null)
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {list.status === "ready"
            ? `${list.tuitions.length} ${
                list.tuitions.length === 1 ? "listing" : "listings"
              }`
            : "Your tuition listings"}
        </p>
        <Link
          href="/dashboard/tuitions/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-coral px-5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          <Plus aria-hidden="true" className="size-4" />
          Post tuition
        </Link>
      </div>

      {sessionPending || list.status === "loading" ? (
        <TableSkeleton columns={5} />
      ) : !token ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
        >
          Your session has expired. Please sign in again.
        </div>
      ) : list.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <p className="text-sm text-ink">{list.message}</p>
          <button
            type="button"
            onClick={refreshList}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest hover:bg-cream-soft"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </button>
        </div>
      ) : list.tuitions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No tuition listings yet"
          description="Create a listing to start receiving student applications."
          action={
            <Link
              href="/dashboard/tuitions/new"
              className="inline-flex h-10 items-center rounded-full bg-coral px-5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Post your first tuition
            </Link>
          }
        />
      ) : (
        <DataTable
          columns={["Tuition", "Approval", "Status", "Fee", "Actions"]}
          className="max-w-full"
        >
          {list.tuitions.map((tuition) => (
            <DataRow key={tuition.id}>
              <td className="px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  {tuition.bannerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tuition.bannerImage}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="size-10 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-stat-mint font-display text-lg font-bold text-forest">
                      {tuition.subject.slice(0, 1)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="max-w-56 truncate font-medium text-ink">
                      {tuition.title}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {tuition.subject} · {tuition.classLevel}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 sm:px-6">
                <StatusBadge status={tuition.approvalStatus} />
              </td>
              <td className="px-5 py-4 sm:px-6">
                <StatusBadge status={tuition.isActive ? "active" : "closed"} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-ink-soft sm:px-6">
                {formatFee(tuition.monthlyFee)}
              </td>
              <td className="px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/tuitions/${encodeURIComponent(tuition.id)}/edit`}
                    aria-label={`Edit ${tuition.title}`}
                    className="rounded-full border border-ink-soft/60 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-cream-soft"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleActivityChange(tuition)}
                    disabled={busyId !== null}
                    className="rounded-full border border-ink-soft/60 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-cream-soft disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyId === tuition.id && busyAction === "activity"
                      ? "Saving..."
                      : tuition.isActive
                        ? "Close"
                        : "Open"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tuition)}
                    disabled={busyId !== null}
                    className="rounded-full border border-ink-soft/60 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-stat-peach disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyId === tuition.id && busyAction === "delete"
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </td>
            </DataRow>
          ))}
        </DataTable>
      )}
    </div>
  )
}
