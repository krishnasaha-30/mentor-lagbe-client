export type TutorDashboardSummary = {
  tuitionsPosted: number
  activeApproved: number
  applicantsCount: number
  latestApplicants: {
    id: string
    student: { name: string; image: string | null; plan: "free" | "pro" } | null
    tuitionTitle: string
    status: "pending" | "accepted" | "rejected"
  }[]
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isTutorDashboardSummary(
  value: unknown
): value is TutorDashboardSummary {
  if (!isRecord(value) || !Array.isArray(value.latestApplicants)) {
    return false
  }

  return (
    Number.isSafeInteger(value.tuitionsPosted) &&
    Number.isSafeInteger(value.activeApproved) &&
    Number.isSafeInteger(value.applicantsCount) &&
    value.latestApplicants.every((application) => {
      if (!isRecord(application)) return false

      const student = application.student
      const validStudent =
        student === null ||
        (isRecord(student) &&
          typeof student.name === "string" &&
          (typeof student.image === "string" || student.image === null) &&
          (student.plan === "free" || student.plan === "pro"))

      return (
        typeof application.id === "string" &&
        typeof application.tuitionTitle === "string" &&
        (application.status === "pending" ||
          application.status === "accepted" ||
          application.status === "rejected") &&
        validStudent
      )
    })
  )
}

export async function getTutorDashboard(
  token: string
): Promise<TutorDashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/api/tutor/dashboard`, {
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

  if (!isTutorDashboardSummary(payload)) {
    throw new Error("The server returned an invalid tutor dashboard summary.")
  }

  return payload
}
