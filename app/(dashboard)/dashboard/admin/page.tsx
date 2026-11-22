import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { getToken } from "@/lib/core/server"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function AdminOverviewPage() {
  const { session } = await requireDashboard(["admin"])
  const token = await getToken()

  return (
    <DashboardPageContent
      role="admin"
      plan={session.user.plan}
      token={token}
    />
  )
}
