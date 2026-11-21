"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string
  showLabel?: boolean
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={cn(
        showLabel
          ? "inline-flex h-auto w-full shrink-0 items-center justify-start gap-3 rounded-xl border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
          : "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-cream-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
        className
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {showLabel ? <span>{isDark ? "Light mode" : "Dark mode"}</span> : null}
    </button>
  )
}
