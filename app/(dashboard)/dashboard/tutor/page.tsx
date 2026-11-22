import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { getToken } from "@/lib/core/server"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function TutorOverviewPage() {
  const { session } = await requireDashboard(["tutor"])
  const token = await getToken()

  return (
    <DashboardPageContent
      role="tutor"
      plan={session.user.plan}
      token={token}
    />
  )
}
