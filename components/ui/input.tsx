import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-lg border border-line bg-white px-4 text-[15px] text-ink shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/60 focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
