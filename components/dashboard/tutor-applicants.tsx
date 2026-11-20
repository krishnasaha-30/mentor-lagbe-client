"use client"

import { RotateCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  getTutorApplications,
  updateApplicationStatus,
  type ApplicationDecision,
  type TutorApplication,
} from "@/lib/api/tutor-applications"
import { authClient } from "@/lib/auth-client"

type ApplicantsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; applications: TutorApplication[] }

export function TutorApplicants() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [state, setState] = useState<ApplicantsState>({ status: "loading" })
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getTutorApplications(token)
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
                : "Could not load your applicants.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  function refreshApplicants() {
    setState({ status: "loading" })
    setRefreshKey((value) => value + 1)
  }

  async function handleDecision(id: string, status: ApplicationDecision) {
    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    setProcessingId(id)

    try {
      await updateApplicationStatus(id, status, token)
      setState((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              applications: current.applications.map((application) =>
                application.id === id ? { ...application, status } : application
              ),
            }
          : current
      )
      toast.success(
        status === "accepted" ? "Applicant accepted." : "Applicant rejected."
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update this applicant."
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      {state.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <p className="text-sm text-ink">{state.message}</p>
          <button
            type="button"
            onClick={refreshApplicants}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest hover:bg-cream-soft"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </button>
        </div>
      ) : sessionPending || state.status === "loading" ? (
        <div
          role="status"
          className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-sm text-ink-soft"
        >
          Loading applicants...
        </div>
      ) : !token ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
        >
          Your session has expired. Please sign in again.
        </div>
      ) : (
        <DataTable
          columns={["Student", "Tuition", "Phone", "Schedule", "Action"]}
          isEmpty={state.applications.length === 0}
          emptyMessage="No students have applied to your tuitions yet."
          className="max-w-full"
        >
          {state.applications.map((application) => (
            <DataRow key={application.id}>
              <td className="px-5 py-3.5 sm:px-6">
                {application.student ? (
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      name={application.student.name}
                      image={application.student.image}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="max-w-36 truncate font-medium text-ink">
                        {application.student.name}
                      </p>
                      <a
                        href={`mailto:${application.student.email}`}
                        className="block max-w-36 truncate text-xs text-ink-soft hover:underline"
                      >
                        {application.student.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <span className="text-ink-soft">Student unavailable</span>
                )}
              </td>
              <td className="px-5 py-3.5 sm:px-6">
                <p className="font-medium text-ink">
                  {application.tuition?.title ?? "Tuition unavailable"}
                </p>
                {application.tuition ? (
                  <p className="mt-1 text-xs text-ink-soft">
                    {application.tuition.subject}
                  </p>
                ) : null}
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-ink-soft sm:px-6">
                <a
                  href={`tel:${application.phone}`}
                  className="hover:text-forest hover:underline"
                >
                  {application.phone}
                </a>
              </td>
              <td
                className="max-w-52 px-5 py-3.5 text-ink-soft sm:px-6"
                title={application.note || undefined}
              >
                <p>{application.preferredSchedule}</p>
                {application.note ? (
                  <p className="mt-1 truncate text-xs">{application.note}</p>
                ) : null}
              </td>
              <td className="px-5 py-3.5 sm:px-6">
                {application.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecision(application.id, "accepted")}
                      disabled={processingId !== null}
                      className="rounded-full bg-forest px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingId === application.id ? "Saving..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(application.id, "rejected")}
                      disabled={processingId !== null}
                      className="rounded-full border border-ink-soft/60 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream-soft disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <StatusBadge status={application.status} />
                )}
              </td>
            </DataRow>
          ))}
        </DataTable>
      )}
    </div>
  )
}
