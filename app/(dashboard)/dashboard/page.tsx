import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function DashboardPage() {
  const { session, role } = await requireDashboard()

  return (
    <DashboardPageContent
      role={role}
      plan={session.user.plan}
      token={session.session.token}
    />
  )
}
