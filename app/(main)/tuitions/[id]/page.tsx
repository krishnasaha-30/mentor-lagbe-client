import Link from "next/link"
import { ArrowLeft, CalendarDays, MapPin, Wallet } from "lucide-react"
import { notFound } from "next/navigation"

import { StatusBadge } from "@/components/dashboard/status-badge"
import { TuitionApplicationForm } from "@/components/sections/tuition-application-form"
import { UserAvatar } from "@/components/ui/user-avatar"
import { getPublicTuition } from "@/lib/api/tuitions"

function formatMonthlyFee(amount: number) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let tuition

  try {
    tuition = await getPublicTuition(id)
  } catch (error) {
    console.error("Could not load tuition details:", error)

    return (
      <main className="page-container py-12">
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <h1 className="font-display text-2xl font-bold text-ink">
            Tuition details could not be loaded
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Please try again later or return to Browse Tuitions.
          </p>
          <Link
            href="/tuitions"
            className="mt-5 inline-flex font-semibold text-forest underline underline-offset-4"
          >
            Browse tuitions
          </Link>
        </div>
      </main>
    )
  }

  if (!tuition) notFound()

  return (
    <main className="page-container py-8 sm:py-12">
      <Link
        href="/tuitions"
        className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Browse Tuitions
      </Link>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="overflow-hidden rounded-[20px] border border-line bg-white">
          {tuition.bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tuition.bannerImage}
              alt={`${tuition.title} banner`}
              referrerPolicy="no-referrer"
              className="max-h-[420px] min-h-48 w-full object-cover"
            />
          ) : (
            <div className="flex min-h-48 items-center justify-center bg-mint px-6 py-12">
              <span className="font-display text-4xl font-bold text-ink">
                {tuition.subject}
              </span>
            </div>
          )}

          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="approved" label={tuition.subject} />
              <StatusBadge status="active" label="Active" />
              <span className="inline-flex items-center rounded-full bg-cream-soft px-3 py-1 text-xs font-semibold text-ink">
                {tuition.mode}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-4xl">
              {tuition.title}
            </h1>
            <p className="mt-2 text-base font-medium text-forest">
              {tuition.classLevel}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-cream-soft p-4">
                <dt className="flex items-center gap-2 text-xs text-ink-soft">
                  <Wallet aria-hidden="true" className="size-4" />
                  Monthly fee
                </dt>
                <dd className="mt-2 font-semibold text-ink">
                  {formatMonthlyFee(tuition.monthlyFee)}
                </dd>
              </div>
              <div className="rounded-xl bg-cream-soft p-4">
                <dt className="flex items-center gap-2 text-xs text-ink-soft">
                  <CalendarDays aria-hidden="true" className="size-4" />
                  Schedule
                </dt>
                <dd className="mt-2 font-semibold text-ink">
                  {tuition.daysPerWeek} days per week
                </dd>
              </div>
              <div className="rounded-xl bg-cream-soft p-4">
                <dt className="flex items-center gap-2 text-xs text-ink-soft">
                  <MapPin aria-hidden="true" className="size-4" />
                  Location
                </dt>
                <dd className="mt-2 font-semibold text-ink">
                  {tuition.location}
                </dd>
              </div>
            </dl>

            <section className="mt-8 border-t border-line pt-6">
              <h2 className="font-display text-xl font-bold text-ink">
                About this tuition
              </h2>
              <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-ink-soft">
                {tuition.description}
              </p>
            </section>

            <section className="mt-8 border-t border-line pt-6">
              <h2 className="font-display text-xl font-bold text-ink">Tutor</h2>
              {tuition.tutor ? (
                <div className="mt-4 flex items-center gap-3">
                  <UserAvatar
                    name={tuition.tutor.name}
                    image={tuition.tutor.image}
                    size="xl"
                  />
                  <div>
                    <p className="font-semibold text-ink">
                      {tuition.tutor.name}
                    </p>
                    {tuition.tutor.plan === "pro" ? (
                      <p className="mt-1 text-sm font-medium text-forest">
                        Pro tutor
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">
                  Tutor details are currently unavailable.
                </p>
              )}
            </section>
          </div>
        </article>

        <aside className="rounded-[20px] border border-line bg-white p-5 sm:p-6 lg:sticky lg:top-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
            Interested?
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">
            Apply for this tuition
          </h2>
          <p className="mt-2 mb-5 text-sm leading-6 text-ink-soft">
            Share your contact details and preferred schedule with the tutor.
          </p>
          <TuitionApplicationForm tuitionId={tuition.id} />
        </aside>
      </div>
    </main>
  )
}
