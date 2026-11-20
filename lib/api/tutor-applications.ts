export type TutorApplication = {
  id: string
  status: "pending" | "accepted" | "rejected"
  phone: string
  preferredSchedule: string
  note: string
  createdAt: string
  student: {
    name: string
    email: string
    image: string | null
    plan: "free" | "pro"
  } | null
  tuition: {
    id: string
    title: string
    subject: string
  } | null
}

export type ApplicationDecision = "accepted" | "rejected"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isTutorApplication(value: unknown): value is TutorApplication {
  if (!isRecord(value)) return false

  const student = value.student
  const tuition = value.tuition
  const validStudent =
    student === null ||
    (isRecord(student) &&
      typeof student.name === "string" &&
      typeof student.email === "string" &&
      (typeof student.image === "string" || student.image === null) &&
      (student.plan === "free" || student.plan === "pro"))
  const validTuition =
    tuition === null ||
    (isRecord(tuition) &&
      typeof tuition.id === "string" &&
      typeof tuition.title === "string" &&
      typeof tuition.subject === "string")

  return (
    typeof value.id === "string" &&
    (value.status === "pending" ||
      value.status === "accepted" ||
      value.status === "rejected") &&
    typeof value.phone === "string" &&
    typeof value.preferredSchedule === "string" &&
    typeof value.note === "string" &&
    typeof value.createdAt === "string" &&
    validStudent &&
    validTuition
  )
}

async function readResponse(response: Response) {
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

  if (!isRecord(payload)) {
    throw new Error("The server returned an invalid response.")
  }

  return payload
}

export async function getTutorApplications(
  token: string
): Promise<TutorApplication[]> {
  const response = await fetch(`${API_BASE_URL}/api/tutor/applications`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  const payload = await readResponse(response)

  if (
    !Array.isArray(payload.applications) ||
    !payload.applications.every(isTutorApplication)
  ) {
    throw new Error("The server returned an invalid applicant list.")
  }

  return payload.applications
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationDecision,
  token: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/applications/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    }
  )
  const payload = await readResponse(response)

  if (payload.id !== id || payload.status !== status) {
    throw new Error("The server did not confirm the applicant decision.")
  }
}
