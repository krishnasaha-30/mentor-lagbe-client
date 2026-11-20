import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { requireDashboard } from "@/lib/dashboard/guard"
import { getMyApplications } from "@/lib/api/applications"

export default async function DashboardPage() {
  const { session, role } = await requireDashboard()
  let studentApplications = null
  let applicationsError = false

  if (role === "student") {
    try {
      const applications = await getMyApplications(session.session.token)
      studentApplications = {
        total: applications.length,
        accepted: applications.filter(
          (application) => application.status === "accepted"
        ).length,
        pending: applications.filter(
          (application) => application.status === "pending"
        ).length,
        recent: applications.slice(0, 3).map((application) => ({
          id: application.id,
          title: application.tuition?.title ?? "Tuition unavailable",
          tutor: application.tuition?.tutor ?? null,
          monthlyFee: application.tuition?.monthlyFee ?? null,
          status: application.status,
        })),
      }
    } catch (error) {
      console.error("Could not load student dashboard applications:", error)
      applicationsError = true
    }
  }

  return (
    <DashboardOverview
      name={session.user.name}
      email={session.user.email}
      role={role}
      plan={session.user.plan}
      studentApplications={studentApplications}
      applicationsError={applicationsError}
    />
  )
}
