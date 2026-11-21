import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { requireDashboard } from "@/lib/dashboard/guard"
import { getMyApplications } from "@/lib/api/applications"
import { getTutorDashboard } from "@/lib/api/tutor-dashboard"
import { getAdminDashboard } from "@/lib/api/admin-dashboard"
import { getToken } from "@/lib/core/server"

export default async function DashboardPage() {
  const { session, role } = await requireDashboard()
  const token = await getToken()
  let studentApplications = null
  let applicationsError = false
  let tutorDashboard = null
  let tutorDashboardError = false
  let adminDashboard = null
  let adminDashboardError = false

  if (role === "student") {
    try {
      const applications = await getMyApplications(token)
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

  if (role === "tutor") {
    try {
      tutorDashboard = await getTutorDashboard(token)
    } catch (error) {
      console.error("Could not load tutor dashboard summary:", error)
      tutorDashboardError = true
    }
  }

  if (role === "admin") {
    try {
      adminDashboard = await getAdminDashboard(token)
    } catch (error) {
      console.error("Could not load admin dashboard summary:", error)
      adminDashboardError = true
    }
  }

  return (
    <DashboardOverview
      role={role}
      plan={session.user.plan}
      studentApplications={studentApplications}
      applicationsError={applicationsError}
      tutorDashboard={tutorDashboard}
      tutorDashboardError={tutorDashboardError}
      adminDashboard={adminDashboard}
      adminDashboardError={adminDashboardError}
    />
  )
}
