import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { getToken } from "@/lib/core/server"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function StudentOverviewPage() {
  const { session } = await requireDashboard(["student"])
  const token = await getToken()

  return (
    <DashboardPageContent
      role="student"
      plan={session.user.plan}
      token={token}
    />
  )
}
