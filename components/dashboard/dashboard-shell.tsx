"use client"

import { useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  DashboardSidebar,
  type DashboardUser,
} from "@/components/dashboard/dashboard-sidebar"
import { cn } from "@/lib/utils"

/**
 * The dashboard frame: fixed forest sidebar + cream content column.
 *
 * Desktop: the header button collapses/expands the sidebar.
 * Mobile:  the same button opens a drawer with the sidebar.
 */
export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  function handleToggle() {
    // `window` is only touched inside an event handler, so this is safe in
    // a client component and never runs during server rendering.
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((value) => !value)
    } else {
      setMobileOpen(true)
    }
  }

  return (
    <div className="min-h-svh bg-cream">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-[250px] transition-transform duration-300 lg:block",
          collapsed && "-translate-x-full"
        )}
      >
        <DashboardSidebar user={user} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[min(260px,calc(100vw-1rem))] shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DashboardSidebar
            user={user}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>

      {/* Content column */}
      <div
        className={cn(
          "flex min-h-svh flex-col transition-[padding] duration-300",
          collapsed ? "lg:pl-0" : "lg:pl-[250px]"
        )}
      >
        <DashboardHeader
          role={user.role}
          name={user.name}
          image={user.image}
          onToggleSidebar={handleToggle}
        />
        <main className="min-w-0 flex-1 px-3 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <div key={pathname} className="dashboard-page-enter min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
