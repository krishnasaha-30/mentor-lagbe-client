import Link from "next/link"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

/**
 * Brand wordmark: bold sans "Mentor" + italic serif "Lagbe".
 * Kept as one component so the logo looks identical everywhere.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="MentorLagbe home"
      className={cn("inline-flex items-baseline gap-0.5", className)}
    >
      <span className="text-[1.35rem] font-bold tracking-[-0.03em] text-ink">
        Mentor
      </span>
      <span className="font-display text-[1.7rem] leading-none font-semibold italic text-coral">
        Lagbe
      </span>
    </Link>
  )
}
