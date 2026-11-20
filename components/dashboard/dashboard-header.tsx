"use client"

import { AlignLeft } from "lucide-react"
import { usePathname } from "next/navigation"

import { UserAvatar } from "@/components/ui/user-avatar"
import {
  getDashboardTitle,
  roleLabel,
  type DashboardRole,
} from "@/lib/dashboard/nav"

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
    <header className="px-4 pt-5 pb-6 sm:px-7 lg:px-8">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 rounded-[22px] border border-line bg-white px-3 py-3 shadow-[0_12px_36px_-30px_rgba(20,35,29,0.5)] sm:gap-5 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-cream text-ink transition-colors hover:bg-cream-soft"
        >
          <AlignLeft className="size-[18px]" strokeWidth={1.75} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.16em] text-coral uppercase">
            {roleLabel[role]} workspace
          </p>
          <h1 className="mt-0.5 truncate font-display text-[1.45rem] leading-tight font-bold tracking-[-0.02em] text-forest sm:text-[1.8rem]">
            {getDashboardTitle(role, pathname)}
          </h1>
        </div>

        <UserAvatar name={name} image={image} size="xl" className="shrink-0" />
      </div>
    </header>
  )
}
