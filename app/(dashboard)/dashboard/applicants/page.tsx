import { TutorApplicants } from "@/components/dashboard/tutor-applicants"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function TutorApplicantsPage() {
  await requireDashboard(["tutor"])

  return <TutorApplicants />
}
