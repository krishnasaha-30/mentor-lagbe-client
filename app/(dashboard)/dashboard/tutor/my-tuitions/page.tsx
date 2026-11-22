import { MyTuitions } from "@/components/dashboard/my-tuitions"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function TutorMyTuitionsPage() {
  await requireDashboard(["tutor"])

  return <MyTuitions />
}
