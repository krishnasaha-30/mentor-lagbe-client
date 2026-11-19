import { redirect } from "next/navigation"

import { isDashboardRole, type DashboardRole } from "@/lib/dashboard/nav"
import { getSession } from "@/lib/core/server"

/**
 * Every dashboard page/layout calls this before rendering.
 *
 * - not signed in      -> /sign-in
 * - signed in, wrong role -> /unauthorized
 *
 * Pass a list to restrict a page to specific roles, e.g.
 *   await requireDashboard(["tutor"])
 */
export async function requireDashboard(roles?: DashboardRole[]) {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  if (!isDashboardRole(session.user.role)) {
    redirect("/unauthorized")
  }

  if (roles && !roles.includes(session.user.role)) {
    redirect("/unauthorized")
  }

  return { session, role: session.user.role }
}
