/**
 * Animated placeholder shown while a dashboard table is loading.
 * It matches the real table's column rhythm so the page does not jump.
 */

const cellWidths = ["w-32", "w-24", "w-20", "w-16", "w-24", "w-20"]

export function TableSkeleton({
  columns = 5,
  rows = 4,
}: {
  columns?: number
  rows?: number
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="overflow-hidden rounded-[20px] border border-line bg-white"
    >
      <div className="animate-pulse overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="flex gap-8 border-b border-line/80 px-6 py-5">
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={index}
                className="h-2.5 w-16 rounded-full bg-cream-soft"
              />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-8 border-b border-line/60 px-6 py-5 last:border-b-0"
            >
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`h-4 rounded-full bg-cream-soft/90 ${
                    cellWidths[cellIndex % cellWidths.length]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
