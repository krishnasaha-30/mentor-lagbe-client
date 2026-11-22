import { SavedTuitions } from "@/components/dashboard/saved-tuitions"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function SavedTuitionsPage() {
  await requireDashboard(["student"])

  return <SavedTuitions />
}
