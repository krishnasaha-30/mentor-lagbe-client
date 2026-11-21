import Link from "next/link"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  onClick?: () => void
  /** "light" renders the wordmark for dark backgrounds (e.g. the auth panel). */
  tone?: "dark" | "light"
}

/**
 * Brand wordmark: bold sans "Mentor" + italic serif "Lagbe".
 * Kept as one component so the logo looks identical everywhere.
 */
export function Logo({ className, onClick, tone = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="MentorLagbe home"
      className={cn(
        "inline-flex items-baseline gap-0.5 whitespace-nowrap",
        className
      )}
    >
      <span
        className={cn(
          "text-[1.15rem] font-bold tracking-[-0.03em] sm:text-[1.35rem]",
          tone === "light" ? "text-white" : "text-ink"
        )}
      >
        Mentor
      </span>
      <span className="font-display text-[1.45rem] leading-none font-semibold text-coral italic sm:text-[1.7rem]">
        Lagbe
      </span>
    </Link>
  )
}
