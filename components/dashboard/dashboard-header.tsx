"use client"

import { AlignLeft } from "lucide-react"
import { usePathname } from "next/navigation"

import { UserAvatar } from "@/components/ui/user-avatar"
import type { DashboardRole } from "@/lib/dashboard/nav"
import { getDashboardTitle } from "@/lib/dashboard/nav"

/**
 * Title bar above every dashboard page. The heading is derived from the
 * current URL, so each page does not need to render its own <h1>.
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
    <header className="flex items-center gap-4 px-4 pt-6 pb-7 sm:gap-5 sm:px-7 lg:px-8">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-cream text-ink transition-colors hover:bg-cream-soft"
      >
        <AlignLeft className="size-[18px]" strokeWidth={1.75} />
      </button>

      <h1 className="min-w-0 flex-1 truncate font-display text-[1.75rem] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[2.1rem]">
        {getDashboardTitle(role, pathname)}
      </h1>

      <UserAvatar name={name} image={image} size="xl" className="shrink-0" />
    </header>
  )
}
