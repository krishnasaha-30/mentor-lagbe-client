import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const tones = {
  mint: "bg-stat-mint",
  butter: "bg-stat-butter",
  peach: "bg-stat-peach",
  lilac: "bg-stat-lilac",
} as const

export type StatTone = keyof typeof tones

/**
 * Pastel summary card used at the top of every overview page.
 * `value` is displayed in the serif display font, like the design.
 */
export function StatCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string
  value: string | number
  tone: StatTone
  icon?: LucideIcon
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[18px] px-3.5 py-4 sm:px-5 sm:py-5",
        tones[tone]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs leading-5 font-medium text-ink/80 sm:text-[13px]">
          {label}
        </p>
        {Icon ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/65 text-forest">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 min-w-0 truncate font-display text-[1.5rem] leading-none font-bold tracking-[-0.02em] text-ink sm:text-[2rem] lg:text-[2.25rem]">
        {value}
      </p>
    </div>
  )
}
