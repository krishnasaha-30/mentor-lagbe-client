import { MyApplications } from "@/components/dashboard/my-applications"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function StudentMyApplicationsPage() {
  await requireDashboard(["student"])

  return <MyApplications />
}
