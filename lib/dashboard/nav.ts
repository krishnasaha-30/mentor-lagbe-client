import {
  BookOpen,
  Bookmark,
  ClipboardCheck,
  FileText,
  Inbox,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"

export type DashboardRole = "student" | "tutor" | "admin"

export type DashboardNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

/**
 * One sidebar per role. Keeping the links in a single config means the
 * sidebar, the mobile menu and the page-title lookup can never drift apart.
 *
 * The URLs follow the role-prefixed routes from the assignment brief:
 *   /dashboard/student, /dashboard/tutor, /dashboard/admin
 */
export const dashboardNav: Record<DashboardRole, DashboardNavItem[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: FileText,
    },
    {
      label: "Saved Tuitions",
      href: "/dashboard/student/saved-tuitions",
      icon: Bookmark,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    {
      label: "Post Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: PlusCircle,
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: BookOpen,
    },
    {
      label: "Applicants",
      href: "/dashboard/tutor/applicants",
      icon: Inbox,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Tuitions",
      href: "/dashboard/admin/tuitions",
      icon: ClipboardCheck,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserRound },
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
  if (/^\/dashboard\/tuitions\/[^/]+\/edit$/.test(pathname)) {
    return "Edit Tuition"
  }

  const titles: Record<string, string> = {
    // Role-scoped routes from the assignment brief.
    "/dashboard/student": "Student Overview",
    "/dashboard/student/my-applications": "My Applications",
    "/dashboard/student/saved-tuitions": "Saved Tuitions",
    "/dashboard/tutor": "Tutor Overview",
    "/dashboard/tutor/post-tuition": "Post a Tuition",
    "/dashboard/tutor/my-tuitions": "My Tuitions",
    "/dashboard/tutor/applicants": "Applicants",
    "/dashboard/admin": "Admin Overview",
    "/dashboard/admin/users": "User Management",
    "/dashboard/admin/tuitions": "Tuition Approvals",
    "/dashboard/admin/transactions": "Transactions",
    // Older shared routes stay supported.
    "/dashboard": "Dashboard",
    "/dashboard/applications": "My Applications",
    "/dashboard/applicants": "Applicants",
    "/dashboard/tuitions": "My Tuitions",
    "/dashboard/tuitions/new": "Post a Tuition",
    "/dashboard/profile": "Update Profile",
  }

  if (pathname === "/dashboard") {
    if (role === "student") return "Student Overview"
    if (role === "tutor") return "Tutor Overview"
    return "Admin Overview"
  }

  return titles[pathname] ?? "Dashboard"
}

/** `/dashboard` must match exactly; every other link also matches its children. */
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Routes share prefixes (for example `/dashboard/tutor` and
 * `/dashboard/tutor/my-tuitions`), so the longest match wins and only one
 * link is highlighted at a time.
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
