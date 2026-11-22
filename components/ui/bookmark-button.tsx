"use client"

import { Bookmark } from "lucide-react"
import { toast } from "sonner"
import { toggleSaveTuition, useIsTuitionSaved } from "@/lib/bookmarks"
import { cn } from "@/lib/utils"

export function BookmarkButton({
  tuitionId,
  tuitionTitle,
  className,
}: {
  tuitionId: string
  tuitionTitle?: string
  className?: string
}) {
  const isSaved = useIsTuitionSaved(tuitionId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const saved = toggleSaveTuition(tuitionId)
    if (saved) {
      toast.success(
        tuitionTitle
          ? `Saved "${tuitionTitle}" to your bookmarks.`
          : "Saved tuition to your bookmarks."
      )
    } else {
      toast.info("Removed tuition from bookmarks.")
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? "Remove from saved tuitions" : "Save this tuition"}
      title={isSaved ? "Saved" : "Save tuition"}
      className={cn(
        "grid size-8 place-items-center rounded-full border transition-all duration-200",
        isSaved
          ? "border-forest bg-forest text-white shadow-sm"
          : "border-line bg-white/90 text-ink-soft hover:border-forest/40 hover:bg-white hover:text-ink",
        className
      )}
    >
      <Bookmark
        className={cn("size-4 transition-transform active:scale-90", isSaved && "fill-current")}
      />
    </button>
  )
}
