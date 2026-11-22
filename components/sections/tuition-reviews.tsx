import { Star, MessageSquare } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { getTuitionReviews } from "@/lib/api/reviews"
import { cn } from "@/lib/utils"

function formatDate(dateString: string) {
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return "Recently"
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d)
}

export async function TuitionReviews({ tuitionId }: { tuitionId: string }) {
  const { reviews, totalReviews, averageRating } = await getTuitionReviews(tuitionId)

  return (
    <section className="mt-8 border-t border-line pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
          <span>Student Reviews</span>
          {totalReviews > 0 ? (
            <span className="rounded-full bg-cream-soft px-2.5 py-0.5 text-xs font-semibold text-forest">
              {totalReviews}
            </span>
          ) : null}
        </h2>

        {totalReviews > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "size-4",
                    star <= Math.round(averageRating)
                      ? "fill-sun text-sun"
                      : "fill-transparent text-ink-soft/40"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-ink">{averageRating}</span>
            <span className="text-xs text-ink-soft">/ 5.0</span>
          </div>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-line bg-cream-soft/40 p-5 text-center">
          <MessageSquare className="mx-auto size-5 text-ink-soft/60" />
          <p className="mt-2 text-xs font-medium text-ink-soft">
            No reviews yet. Students whose applications get accepted can rate and review this tuition.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-line/70 bg-cream-soft/30 p-4 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    name={review.studentName}
                    image={review.studentImage}
                    size="sm"
                  />
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      {review.studentName}
                    </p>
                    <p className="text-[10px] text-ink-soft">
                      Verified Student · {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "size-3.5",
                        star <= review.rating
                          ? "fill-sun text-sun"
                          : "fill-transparent text-ink-soft/30"
                      )}
                    />
                  ))}
                </div>
              </div>

              {review.feedback ? (
                <p className="mt-2.5 text-xs text-ink-soft leading-relaxed">
                  &ldquo;{review.feedback}&rdquo;
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
