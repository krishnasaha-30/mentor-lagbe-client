"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Counts from 0 to `value` when the number scrolls into view.
 * The server renders 0, so markup is stable and there is no hydration
 * mismatch; the animation only starts in the browser.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduceMotion || value === 0) {
      const frame = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(frame)
    }

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(frame)
    }

    let frame = 0

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()

        const startedAt = performance.now()

        function tick(now: number) {
          const progress = Math.min((now - startedAt) / duration, 1)
          // ease-out cubic: fast at first, settles on the final number.
          const eased = 1 - Math.pow(1 - progress, 3)

          setDisplay(Math.round(value * eased))

          if (progress < 1) {
            frame = requestAnimationFrame(tick)
          }
        }

        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("en").format(display)}
    </span>
  )
}
