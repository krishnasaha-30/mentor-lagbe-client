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
 * The optional icon gives each stat a quick visual cue.
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
        "relative overflow-hidden rounded-[18px] px-4 py-4 sm:rounded-[20px] sm:px-5 sm:py-5",
        tones[tone]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs leading-tight font-medium text-ink/75 sm:text-[13px]">
          {label}
        </p>
        {Icon ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/55 text-ink/70">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-display text-[2rem] leading-none font-bold tracking-[-0.02em] text-ink sm:text-[2.35rem]">
        {value}
      </p>
    </div>
  )
}
