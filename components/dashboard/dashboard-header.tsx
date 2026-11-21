"use client"

import { AlignLeft, Bell, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { SubscriptionAction } from "@/components/billing/subscription-action"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  getDashboardTitle,
  roleLabel,
  type DashboardRole,
} from "@/lib/dashboard/nav"

/**
 * Title bar above every dashboard page. It follows the dashboard design:
 * breadcrumb + serif page title on the left, then search, plan action,
 * notifications and the signed-in user on the right.
 *
 * The heading still comes from the current URL, so pages never repeat
 * their own <h1>.
 */
export function DashboardHeader({
  role,
  name,
  image,
  onToggleSidebar,
}: {
  role: DashboardRole
  name: string
  image: string | null
  onToggleSidebar: () => void
}) {
  const pathname = usePathname()

  return (
    <header className="mb-4 border-b border-line bg-cream px-3 py-3.5 sm:mb-6 sm:px-6 sm:py-5 lg:px-8">
      <div className="dashboard-page-enter mx-auto flex max-w-[1200px] min-w-0 items-center gap-2.5 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/70 text-ink transition-all duration-200 hover:scale-[1.04] hover:bg-white hover:shadow-sm active:scale-95 sm:size-11"
        >
          <AlignLeft className="size-[18px]" strokeWidth={1.75} />
        </button>

        <div className="min-w-0 flex-1">
          <p
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.02em] text-ink-soft"
          >
            <span>Dashboard</span>
            <span aria-hidden="true">/</span>
            <span>{roleLabel[role].toLowerCase()}</span>
          </p>
          <h1 className="mt-0.5 truncate font-display text-[1.25rem] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[1.65rem] lg:text-[1.9rem]">
            {getDashboardTitle(role, pathname)}
          </h1>
        </div>

        <form
          role="search"
          action="/tuitions"
          className="hidden h-11 w-[220px] shrink-0 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition-all duration-200 focus-within:border-forest/30 focus-within:shadow-[0_12px_30px_-24px_rgba(20,35,29,0.75)] focus-within:ring-2 focus-within:ring-forest/10 xl:flex"
        >
          <Search
            aria-hidden="true"
            className="size-4 shrink-0 text-ink-soft"
          />
          <input
            type="search"
            name="q"
            aria-label="Search tuitions"
            placeholder="Search..."
            className="h-full w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/70"
          />
        </form>

        {role !== "admin" ? (
          <SubscriptionAction
            requiredRole={role}
            subscribeLabel="Upgrade to Pro"
            className="hidden h-11 shrink-0 items-center rounded-full bg-coral px-5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-coral-dark hover:text-white hover:shadow-lg hover:shadow-coral/25 sm:inline-flex"
          />
        ) : null}

        <button
          type="button"
          onClick={() => toast("You're all caught up — no new notifications.")}
          aria-label="Notifications"
          className="group hidden size-11 shrink-0 place-items-center rounded-xl border border-line bg-white/70 text-ink transition-colors duration-200 hover:bg-white sm:grid"
        >
          <Bell
            aria-hidden="true"
            className="size-[18px] transition-transform duration-300 group-hover:-rotate-12"
            strokeWidth={1.75}
          />
        </button>

        <ThemeToggle className="size-10 sm:size-11" />

        <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-white py-1 pr-2 pl-1 transition-colors duration-200 hover:border-forest/20 sm:pr-3 lg:pr-4">
          <UserAvatar
            name={name}
            image={image}
            size="lg"
            className="ring-2 ring-cream-soft"
          />
          <div className="hidden min-w-0 lg:block">
            <p className="max-w-[130px] truncate text-sm leading-tight font-semibold text-ink">
              {name}
            </p>
            <p className="mt-0.5 truncate text-xs leading-tight text-ink-soft">
              {roleLabel[role]}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
