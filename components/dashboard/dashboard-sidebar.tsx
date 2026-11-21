"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  House,
  LayoutDashboard,
  Receipt,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/ui/user-avatar"
import { authClient } from "@/lib/auth-client"
import type { DashboardRole } from "@/lib/dashboard/nav"
import { dashboardNav, getActiveHref, roleLabel } from "@/lib/dashboard/nav"
import { cn } from "@/lib/utils"

const navigationIcons: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/applications": FileCheck2,
  "/dashboard/profile": UserRound,
  "/dashboard/tuitions/new": BookOpen,
  "/dashboard/tuitions": BookOpen,
  "/dashboard/applicants": Users,
  "/dashboard/admin/users": Users,
  "/dashboard/admin/tuitions": ClipboardCheck,
  "/dashboard/admin/transactions": Receipt,
}

export type DashboardUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: DashboardRole
}

export function DashboardSidebar({
  user,
  onNavigate,
}: {
  user: DashboardUser
  /** Closes the mobile drawer when a link is tapped. */
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  const items = dashboardNav[user.role]
  const activeHref = getActiveHref(items, pathname)

  async function handleSignOut() {
    const { error } = await authClient.signOut()

    if (error) {
      toast.error(error.message ?? "Could not sign out. Please try again.")
      return
    }

    onNavigate?.()
    toast.success("Signed out")
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col bg-forest-deep px-4 pt-7 pb-6">
      <div className="px-2">
        <Logo tone="light" />
      </div>

      {/* Signed-in user + role */}
      <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
        <UserAvatar name={user.name} image={user.image} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>
          <span className="mt-1 inline-flex rounded-full bg-butter px-2.5 py-[2px] text-[11px] font-semibold text-ink">
            {roleLabel[user.role]}
          </span>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {items.map((item) => {
          const isActive = item.href === activeHref
          const Icon = navigationIcons[item.href]

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-forest-active text-white"
                  : "text-white/85 hover:bg-white/5 hover:text-white"
              )}
            >
              {Icon ? (
                <Icon aria-hidden="true" className="size-4 shrink-0" />
              ) : null}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 space-y-1 border-t border-white/10 pt-5">
        <ThemeToggle
          showLabel
          className="rounded-xl transition-colors hover:bg-white/5"
        />
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
        >
          <House aria-hidden="true" className="size-4" />
          Back to home
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
