import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function TutorOverviewPage() {
  const { session } = await requireDashboard(["tutor"])

  return (
    <DashboardPageContent
      role="tutor"
      plan={session.user.plan}
      token={session.session.token}
    />
  )
}
