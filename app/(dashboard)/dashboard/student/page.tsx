import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function StudentOverviewPage() {
  const { session } = await requireDashboard(["student"])

  return (
    <DashboardPageContent
      role="student"
      plan={session.user.plan}
      token={session.session.token}
    />
  )
}
