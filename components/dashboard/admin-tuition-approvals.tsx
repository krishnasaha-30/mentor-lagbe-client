"use client"

import { Check, ExternalLink, RotateCw, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  getPendingTuitions,
  updateTuitionApproval,
} from "@/lib/api/admin-tuitions"
import { authClient } from "@/lib/auth-client"
import type {
  AdminTuitionApproval,
  PendingTuition,
} from "@/lib/types/admin-tuition"

type QueueState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; tuitions: PendingTuition[] }

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable"
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function AdminTuitionApprovals() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [queue, setQueue] = useState<QueueState>({ status: "loading" })
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getPendingTuitions(token)
      .then((tuitions) => {
        if (!cancelled) {
          setQueue({ status: "ready", tuitions })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setQueue({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Could not load pending tuition approvals.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  async function handleDecision(
    id: string,
    approvalStatus: AdminTuitionApproval
  ) {
    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    setProcessingId(id)

    try {
      await updateTuitionApproval(id, approvalStatus, token)
      setQueue((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              tuitions: current.tuitions.filter((tuition) => tuition.id !== id),
            }
          : current
      )
      toast.success(
        approvalStatus === "approved"
          ? "Tuition approved and published."
          : "Tuition rejected."
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the tuition approval."
      )
    } finally {
      setProcessingId(null)
    }
  }

  function refreshQueue() {
    setQueue({ status: "loading" })
    setRefreshKey((value) => value + 1)
  }

  return (
    <div className="mx-auto max-w-[1100px] pb-8">
      <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
            Admin review
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-ink">
            Tuition Approvals
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Review tutor submissions before they appear in Browse.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={refreshQueue}
          disabled={queue.status === "loading" || processingId !== null}
          className="h-10 gap-2 rounded-full border-line bg-white px-4 text-ink"
        >
          <RotateCw aria-hidden="true" />
          Refresh
        </Button>
      </section>

      {!sessionPending && !token ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
        >
          Your session has expired. Please sign in again.
        </div>
      ) : queue.status === "loading" ? (
        <div
          role="status"
          className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-sm text-ink-soft"
        >
          Loading pending tuition submissions...
        </div>
      ) : queue.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <p className="text-sm text-ink">{queue.message}</p>
          <Button
            type="button"
            onClick={refreshQueue}
            className="mt-4 h-10 rounded-full bg-coral px-5 text-ink hover:bg-coral-dark"
          >
            Try again
          </Button>
        </div>
      ) : queue.tuitions.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-white px-6 py-14 text-center">
          <h3 className="font-display text-xl font-bold text-ink">
            You&apos;re all caught up
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            There are no tuition submissions waiting for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-ink-soft">
            {queue.tuitions.length}{" "}
            {queue.tuitions.length === 1 ? "submission" : "submissions"} waiting
            for review
          </p>
          {queue.tuitions.map((tuition) => (
            <article
              key={tuition.id}
              className="rounded-[20px] border border-line bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-stat-butter px-3 py-1 text-xs font-semibold text-ink">
                      Pending review
                    </span>
                    <span className="text-xs text-ink-soft">
                      Submitted {formatDate(tuition.createdAt)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink">
                    {tuition.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-forest">
                    {tuition.subject} · {tuition.classLevel}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">
                    {tuition.description}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <dt className="text-xs text-ink-soft">Mode</dt>
                      <dd className="mt-1 font-medium text-ink">
                        {tuition.mode}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-soft">Location</dt>
                      <dd className="mt-1 font-medium text-ink">
                        {tuition.location}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-soft">Monthly fee</dt>
                      <dd className="mt-1 font-medium text-ink">
                        ৳{tuition.monthlyFee.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-soft">Schedule</dt>
                      <dd className="mt-1 font-medium text-ink">
                        {tuition.daysPerWeek} days per week
                      </dd>
                    </div>
                  </dl>
                </div>

                <aside className="flex shrink-0 flex-col justify-between gap-4 border-t border-line pt-4 lg:w-[250px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase">
                      Tutor
                    </p>
                    {tuition.tutor ? (
                      <div className="mt-3 flex items-center gap-3">
                        <UserAvatar
                          name={tuition.tutor.name}
                          image={tuition.tutor.image}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">
                            {tuition.tutor.name}
                          </p>
                          <p className="truncate text-xs text-ink-soft">
                            {tuition.tutor.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-ink-soft">
                        Tutor account unavailable
                      </p>
                    )}
                    {tuition.bannerImage ? (
                      <a
                        href={tuition.bannerImage}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline-offset-4 hover:underline"
                      >
                        View banner
                        <ExternalLink aria-hidden="true" className="size-4" />
                      </a>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => handleDecision(tuition.id, "approved")}
                      disabled={processingId !== null}
                      className="h-10 flex-1 gap-2 rounded-full bg-forest px-4 text-white hover:bg-forest/90"
                    >
                      <Check aria-hidden="true" />
                      {processingId === tuition.id ? "Saving..." : "Approve"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDecision(tuition.id, "rejected")}
                      disabled={processingId !== null}
                      className="h-10 flex-1 gap-2 rounded-full border-line px-4 text-ink hover:bg-stat-peach"
                    >
                      <X aria-hidden="true" />
                      Reject
                    </Button>
                  </div>
                </aside>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
