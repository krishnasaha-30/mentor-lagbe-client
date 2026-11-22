import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function AdminOverviewPage() {
  const { session } = await requireDashboard(["admin"])

  return (
    <DashboardPageContent
      role="admin"
      plan={session.user.plan}
      token={session.session.token}
    />
  )
}
