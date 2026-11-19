import { cn } from "@/lib/utils"

export type StatusKind =
  | "pending"
  | "approved"
  | "accepted"
  | "rejected"
  | "active"
  | "closed"
  | "free"
  | "pro"

const styles: Record<StatusKind, string> = {
  pending: "bg-stat-butter text-[#8a6410]",
  approved: "bg-stat-mint text-[#0b6b4f]",
  accepted: "bg-stat-mint text-[#0b6b4f]",
  rejected: "bg-stat-peach text-[#c2410c]",
  active: "bg-stat-mint text-[#0b6b4f]",
  closed: "bg-cream-soft text-ink-soft",
  free: "bg-cream-soft text-ink-soft",
  pro: "bg-stat-lilac text-[#4c3a99]",
}

const labels: Partial<Record<StatusKind, string>> = {
  approved: "Approved",
  accepted: "Accepted",
  rejected: "Rejected",
  pending: "Pending",
  active: "Active",
  closed: "Closed",
  free: "Free",
  pro: "Pro",
}

/** Small rounded pill used for approval, application and plan states. */
export function StatusBadge({
  status,
  label,
  className,
}: {
  status: StatusKind
  /** Override the default text, e.g. "Pro Tutor". */
  label?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[12px] leading-5 font-semibold",
        styles[status],
        className
      )}
    >
      {label ?? labels[status] ?? status}
    </span>
  )
}
