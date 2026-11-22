import { StatCard } from "@/components/dashboard/stat-card"

/**
 * Dashboard-level skeleton. It mirrors the overview layout (four pastel
 * cards + a white table panel) so the real content does not shift the page.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1200px] pb-8" role="status" aria-label="Loading dashboard">
      <div className="mb-4 grid overflow-hidden rounded-[20px] border border-line bg-white md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-2 p-5">
          <div className="h-3 w-40 animate-pulse rounded-full bg-cream-soft" />
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-cream-soft" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-cream-soft/80" />
        </div>
        <div className="min-h-[112px] animate-pulse bg-cream-soft md:min-h-[150px]" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Loading" value="—" tone="mint" />
        <StatCard label="Loading" value="—" tone="butter" />
        <StatCard label="Loading" value="—" tone="peach" />
        <StatCard label="Loading" value="—" tone="lilac" />
      </div>

      <div className="mt-6 overflow-hidden rounded-[20px] border border-line bg-white">
        <div className="flex gap-8 border-b border-line/80 px-6 py-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-2.5 w-16 animate-pulse rounded-full bg-cream-soft"
            />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-8 border-b border-line/60 px-6 py-5 last:border-b-0"
          >
            {Array.from({ length: 4 }).map((_, cellIndex) => (
              <div
                key={cellIndex}
                className="h-4 w-24 animate-pulse rounded-full bg-cream-soft/90"
              />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading dashboard…</span>
    </div>
  )
}
