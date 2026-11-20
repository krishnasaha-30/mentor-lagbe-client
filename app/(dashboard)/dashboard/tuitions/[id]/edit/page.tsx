import { notFound } from "next/navigation"

import { PostTuitionForm } from "@/components/dashboard/post-tuition-form"
import { getMyTuitions } from "@/lib/api/tutor-tuitions"
import { getToken } from "@/lib/core/server"
import { requireDashboard } from "@/lib/dashboard/guard"
import type { TutorTuition } from "@/lib/types/tuition"

export default async function EditTuitionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireDashboard(["tutor"])
  const { id } = await params
  const token = await getToken()
  let tuitions: TutorTuition[]

  try {
    tuitions = await getMyTuitions(token)
  } catch (error) {
    console.error("Could not load tuition for editing:", error)

    return (
      <div
        role="alert"
        className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
      >
        Tuition details could not be loaded. Please try again later.
      </div>
    )
  }

  const tuition = tuitions.find((item) => item.id === id)

  if (!tuition) notFound()

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <p className="mb-4 text-sm leading-6 text-ink-soft">
        Changes to a tuition listing are sent to an admin for review before they
        are published.
      </p>
      <PostTuitionForm usage={null} usageError={false} tuition={tuition} />
    </div>
  )
}
