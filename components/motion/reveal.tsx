"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Fades + lifts its children into view the first time they are scrolled to.
 *
 * The `.reveal` / `.reveal-visible` classes live in globals.css, and
 * `prefers-reduced-motion` disables the effect for users who ask for it.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /** Stagger in milliseconds, e.g. 0, 80, 160 for a row of cards. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Very old browsers without IntersectionObserver just show the content.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Wait until the element is a little way inside the viewport.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
