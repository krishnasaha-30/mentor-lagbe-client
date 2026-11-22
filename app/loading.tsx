import { GraduationCap } from "lucide-react"

/**
 * Root loading state. Next.js shows this instantly while a route's server
 * component is fetching data, so navigation never feels frozen.
 */
export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-cream px-6">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-forest/15" />
        <span className="relative grid size-14 place-items-center rounded-2xl bg-forest text-white shadow-lg shadow-forest/20">
          <GraduationCap aria-hidden="true" className="size-6" />
        </span>
      </div>
      <p className="text-sm font-semibold text-ink">Loading MentorLagbe…</p>
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-cream-soft">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-forest" />
      </div>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  )
}
