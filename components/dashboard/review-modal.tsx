"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { submitTuitionReview } from "@/lib/api/reviews"
import { cn } from "@/lib/utils"

export function ReviewModal({
  tuitionId,
  tuitionTitle,
  token,
  isOpen,
  onClose,
  onSuccess,
}: {
  tuitionId: string
  tuitionTitle: string
  token: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please choose a rating from 1 to 5 stars.")
      return
    }

    setSubmitting(true)
    try {
      await submitTuitionReview(tuitionId, { rating, feedback }, token)
      toast.success("Thank you! Your review has been submitted.")
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review.")
    } finally {
      setSubmitting(false)
    }
  }

  const activeRating = hoverRating ?? rating

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-[24px] border border-line bg-white p-6 shadow-2xl dark:bg-[#18241e]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full border border-line text-ink-soft hover:bg-cream-soft hover:text-ink"
        >
          <X className="size-4" />
        </button>

        <h3 className="font-display text-xl font-bold text-ink">
          Review Tuition
        </h3>
        <p className="mt-1 text-xs text-ink-soft">
          Share your experience for <span className="font-semibold text-ink">{tuitionTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="mt-2 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "size-7 transition-colors",
                      star <= activeRating
                        ? "fill-sun text-sun"
                        : "fill-transparent text-ink-soft/40"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-forest">
                {activeRating} / 5
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="review-feedback"
              className="block text-xs font-semibold text-ink"
            >
              Feedback / Note (Optional)
            </label>
            <textarea
              id="review-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="How was the teaching, pace, and support?"
              className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white p-3 text-xs text-ink outline-none placeholder:text-ink-soft/60 focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15 dark:bg-[#1f2e27]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="h-9 rounded-full px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 rounded-full bg-coral px-5 text-xs font-semibold text-white hover:bg-coral-dark"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
