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
}: {
  label: string
  value: string | number
  tone: StatTone
}) {
  return (
    <div className={cn("rounded-[20px] px-5 py-5", tones[tone])}>
      <p className="text-[13px] font-medium text-ink/80">{label}</p>
      <p className="mt-2 font-display text-[2.5rem] leading-none font-bold tracking-[-0.02em] text-ink">
        {value}
      </p>
    </div>
  )
}
