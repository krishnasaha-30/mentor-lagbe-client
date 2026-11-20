import { MyApplications } from "@/components/dashboard/my-applications"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function MyApplicationsPage() {
  await requireDashboard(["student"])

  return <MyApplications />
}
