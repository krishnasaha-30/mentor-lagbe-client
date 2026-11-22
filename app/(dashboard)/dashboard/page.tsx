import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { getToken } from "@/lib/core/server"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function DashboardPage() {
  const { session, role } = await requireDashboard()
  const token = await getToken()

  return (
    <DashboardPageContent
      role={role}
      plan={session.user.plan}
      token={token}
    />
  )
}
