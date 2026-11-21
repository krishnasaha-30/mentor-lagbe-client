import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

/** Friendly empty state shared by every dashboard table. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-cream-soft text-forest">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-4 font-display text-xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-soft">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}
