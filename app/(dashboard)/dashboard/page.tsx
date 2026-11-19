import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function DashboardPage() {
  const { session, role } = await requireDashboard()

  return (
    <DashboardOverview
      name={session.user.name}
      email={session.user.email}
      role={role}
      plan={session.user.plan}
    />
  )
}
