import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * The white rounded panel that holds every dashboard table.
 * Rows are passed as children so each page can use its own columns.
 */
export function DataTable({
  columns,
  isEmpty = false,
  emptyMessage = "Nothing here yet.",
  children,
  className,
}: {
  columns: string[]
  isEmpty?: boolean
  emptyMessage?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-line bg-white",
        className
      )}
    >
      <div
        role="region"
        aria-label="Scrollable data table"
        tabIndex={0}
        className="overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-forest"
      >
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line/80">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-5 text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center text-sm text-ink-soft"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Standard data row with the divider the design uses between rows. */
export function DataRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <tr
      className={cn(
        "border-b border-line/70 text-sm text-ink last:border-b-0",
        className
      )}
    >
      {children}
    </tr>
  )
}
