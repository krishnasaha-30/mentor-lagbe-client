import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { getAdminDashboard } from "@/lib/api/admin-dashboard"
import { getMyApplications } from "@/lib/api/applications"
import { getTutorDashboard } from "@/lib/api/tutor-dashboard"
import type { DashboardRole } from "@/lib/dashboard/nav"

/**
 * Server component shared by `/dashboard` and the role-scoped overview
 * routes (`/dashboard/student`, `/dashboard/tutor`, `/dashboard/admin`).
 *
 * It loads the summary that belongs to the signed-in role and renders the
 * same dashboard, so every entry point stays in sync.
 */
export async function DashboardPageContent({
  role,
  plan,
  token,
}: {
  role: DashboardRole
  plan: "free" | "pro"
  token: string
}) {
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
      plan={plan}
      studentApplications={studentApplications}
      applicationsError={applicationsError}
      tutorDashboard={tutorDashboard}
      tutorDashboardError={tutorDashboardError}
      adminDashboard={adminDashboard}
      adminDashboardError={adminDashboardError}
    />
  )
}
