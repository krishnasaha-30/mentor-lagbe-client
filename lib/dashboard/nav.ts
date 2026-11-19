export type DashboardRole = "student" | "tutor" | "admin"

export type DashboardNavItem = {
  label: string
  href: string
}

/**
 * One sidebar per role. Keeping the links in a single config means the
 * sidebar, the mobile menu and the page-title lookup can never drift apart.
 */
export const dashboardNav: Record<DashboardRole, DashboardNavItem[]> = {
  student: [
    { label: "Overview", href: "/dashboard" },
    { label: "My Applications", href: "/dashboard/applications" },
    { label: "Update Profile", href: "/dashboard/profile" },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard" },
    { label: "Post Tuition", href: "/dashboard/tuitions/new" },
    { label: "My Tuitions", href: "/dashboard/tuitions" },
    { label: "Applicants", href: "/dashboard/applicants" },
    { label: "Update Profile", href: "/dashboard/profile" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Tuitions", href: "/dashboard/admin/tuitions" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
    { label: "Update Profile", href: "/dashboard/profile" },
  ],
}

export const roleLabel: Record<DashboardRole, string> = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
}

/**
 * Narrow the BetterAuth value (which is only student | tutor in the schema)
 * to the roles the dashboard knows about.
 */
export function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "student" || value === "tutor" || value === "admin"
}

/** Page heading, e.g. /dashboard/admin/users -> "User Management". */
export function getDashboardTitle(
  role: DashboardRole,
  pathname: string
): string {
  if (pathname === "/dashboard") {
    if (role === "student") return "Student Overview"
    if (role === "tutor") return "Tutor Overview"
    return "Admin Overview"
  }

  const titles: Record<string, string> = {
    "/dashboard/applications": "My Applications",
    "/dashboard/applicants": "Applicants",
    "/dashboard/tuitions": "My Tuitions",
    "/dashboard/tuitions/new": "Post a Tuition",
    "/dashboard/profile": "Update Profile",
    "/dashboard/admin/users": "User Management",
    "/dashboard/admin/tuitions": "Tuition Approvals",
    "/dashboard/admin/transactions": "Transactions",
  }

  return titles[pathname] ?? "Dashboard"
}

/** `/dashboard` must match exactly; every other link also matches its children. */
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * `/dashboard/tuitions` is a prefix of `/dashboard/tuitions/new`, so the
 * longest match wins and only one link is highlighted at a time.
 */
export function getActiveHref(
  items: DashboardNavItem[],
  pathname: string
): string | null {
  const matches = items.filter((item) => isNavItemActive(item.href, pathname))
  if (matches.length === 0) return null

  return matches.reduce((longest, item) =>
    item.href.length > longest.href.length ? item : longest
  ).href
}
