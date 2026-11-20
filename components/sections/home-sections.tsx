import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

import { SubscriptionAction } from "@/components/billing/subscription-action"
import { TuitionCard } from "@/components/sections/tuition-card"
import { Logo } from "@/components/layout/logo"
import type { PublicStats } from "@/lib/api/public-stats"
import type { PublicTuition } from "@/lib/types/tuition"

const subjects = [
  { name: "Math", mark: "∑", tone: "bg-mint" },
  { name: "Physics", mark: "E=mc²", tone: "bg-peach" },
  { name: "Programming", mark: "</>", tone: "bg-lilac" },
  { name: "IELTS", mark: "IELTS", tone: "bg-stat-butter" },
  { name: "English", mark: "Aa", tone: "bg-[#d9effc]" },
  { name: "Chemistry", mark: "H₂O", tone: "bg-[#dff2d6]" },
] as const

const steps = [
  {
    number: "1",
    title: "Create an account",
    description: "Sign up as a student or tutor.",
    tone: "bg-stat-butter",
  },
  {
    number: "2",
    title: "Post or search",
    description: "Tutors list batches, students filter.",
    tone: "bg-mint",
  },
  {
    number: "3",
    title: "Apply in minutes",
    description: "One short form, no back-and-forth.",
    tone: "bg-peach",
  },
  {
    number: "4",
    title: "Start learning",
    description: "Tutors accept and sessions begin.",
    tone: "bg-lilac",
  },
] as const

const testimonials = [
  {
    quote: "I found a great math tutor and started classes the same week.",
    name: "Ayesha R.",
    role: "Student",
  },
  {
    quote: "Posting my tuition helped me connect with families in my area.",
    name: "Kamal H.",
    role: "Tutor",
  },
  {
    quote: "The subject and budget filters made the search much easier.",
    name: "Shafin M.",
    role: "Parent",
  },
] as const

const questions = [
  {
    question: "How are tutors verified?",
    answer:
      "Tuition listings are reviewed by an admin before approval and publication. Tutor identity verification is not currently offered.",
  },
  {
    question: "Can I apply to more than one tuition?",
    answer:
      "Yes. Students can apply to multiple listings, but only once to each tuition.",
  },
  {
    question: "How does the Pro plan work?",
    answer:
      "Pro Tutor is $15/month and removes the tuition-post limit. Pro Student is $10/month and moves applications higher in tutors' applicant lists, while tutors make the final selection. Subscribe or manage your plan securely through Stripe.",
  },
  {
    question: "Is online tuition available?",
    answer:
      "Yes. Browse listings include both online and offline tuition options.",
  },
] as const

function formatCount(value: number | undefined) {
  return value === undefined ? "—" : new Intl.NumberFormat("en").format(value)
}

export function HomeSections({
  tuitions,
  tuitionsError,
  stats,
  statsError,
}: {
  tuitions: PublicTuition[]
  tuitionsError: boolean
  stats: PublicStats | null
  statsError: boolean
}) {
  const metrics = [
    { value: stats?.tutors, label: "Tutor accounts" },
    { value: stats?.activeTuitions, label: "Active listings" },
    { value: stats?.subjects, label: "Subjects" },
    { value: stats?.acceptedApplications, label: "Accepted applications" },
  ]

  return (
    <>
      <nav
        aria-label="Popular subjects"
        className="overflow-x-auto bg-forest-deep text-white"
      >
        <div className="page-container flex min-w-max items-center justify-between gap-8 py-3.5 text-sm font-semibold sm:gap-10">
          {subjects.map((subject, index) => (
            <div
              key={subject.name}
              className="flex items-center gap-8 sm:gap-10"
            >
              <Link
                href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                className="transition-colors hover:text-mint"
              >
                {subject.name}
              </Link>
              {index < subjects.length - 1 ? (
                <Sparkles
                  aria-hidden="true"
                  className="size-3 text-stat-butter"
                />
              ) : null}
            </div>
          ))}
        </div>
      </nav>

      <section
        id="subjects"
        className="page-container scroll-mt-24 py-14 sm:py-16"
      >
        <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
          Top subjects
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
          Explore by subject
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Popular categories students search for.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
              className={`group flex min-h-24 flex-col justify-between rounded-2xl p-4 transition-transform hover:-translate-y-1 ${subject.tone}`}
            >
              <span className="font-display text-2xl font-bold text-ink">
                {subject.mark}
              </span>
              <span className="text-xs font-semibold text-ink">
                {subject.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream-soft/60 py-14 sm:py-16">
        <div className="page-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
                Featured
              </p>
              <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
                Latest approved tuitions
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Fresh listings reviewed by our admin team.
              </p>
            </div>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
            >
              Browse all
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {tuitionsError ? (
            <div
              role="alert"
              className="mt-6 rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
            >
              Latest tuitions could not be loaded. You can still browse all
              listings.
            </div>
          ) : tuitions.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tuitions.map((tuition) => (
                <TuitionCard key={tuition.id} tuition={tuition} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[20px] border border-line bg-white px-6 py-10 text-center">
              <p className="font-semibold text-ink">No approved tuitions yet</p>
              <p className="mt-2 text-sm text-ink-soft">
                Check back soon or explore the full listings page.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 bg-white py-14 sm:py-16"
      >
        <div className="page-container">
          <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
            How it works
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
            Four steps to better learning
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Simple for students, effortless for tutors.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm font-bold text-ink ${step.tone}`}
                >
                  {step.number}
                </span>
                <h3 className="mt-3 text-sm font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-ink-soft">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container grid gap-4 py-10 sm:grid-cols-2 sm:py-14">
        <article className="rounded-[20px] bg-peach p-6 sm:p-8">
          <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
            For students
          </p>
          <h2 className="mt-2 max-w-sm font-display text-xl leading-tight font-bold text-ink sm:text-2xl">
            Learn with someone who fits you
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Filter, compare, and apply in minutes.
          </p>
          <Link
            href="/tuitions"
            className="mt-5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-forest"
          >
            Find a Tutor
          </Link>
        </article>
        <article className="rounded-[20px] bg-mint p-6 sm:p-8">
          <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
            For tutors
          </p>
          <h2 className="mt-2 max-w-sm font-display text-xl leading-tight font-bold text-ink sm:text-2xl">
            Grow your tuition batch
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Post listings and manage applicants in one place.
          </p>
          <Link
            href="/sign-up"
            className="mt-5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-forest"
          >
            Become a Tutor
          </Link>
        </article>
      </section>

      <section
        aria-label="MentorLagbe platform statistics"
        className="bg-forest py-9 text-white sm:py-11"
      >
        <div className="page-container">
          {statsError ? (
            <p role="status" className="mb-5 text-center text-xs text-white/75">
              Platform statistics are temporarily unavailable.
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="font-display text-3xl font-bold text-stat-butter sm:text-4xl">
                  {formatCount(metric.value)}
                </p>
                <p className="mt-1 text-xs text-white/80">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-14 sm:py-16">
        <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
          Testimonials
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
          Loved by students and tutors
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Sample feedback for the demo.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <blockquote className="min-h-16 text-sm leading-6 text-ink-soft">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2">
                <span
                  className={`grid size-8 place-items-center rounded-full text-xs font-bold text-ink ${
                    index === 0
                      ? "bg-stat-butter"
                      : index === 1
                        ? "bg-mint"
                        : "bg-peach"
                  }`}
                >
                  {testimonial.name[0]}
                </span>
                <span>
                  <span className="block text-xs font-semibold text-ink">
                    {testimonial.name}
                  </span>
                  <span className="block text-[10px] text-ink-soft">
                    {testimonial.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 bg-white py-14 sm:py-16">
        <div className="page-container">
          <p className="text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
            Pricing
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
            Upgrade when you are ready
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Free to start. Pro plans unlock more.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[20px] border border-line bg-white p-5">
              <h3 className="font-display text-lg font-bold text-ink">Free</h3>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                $0
              </p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-ink-soft">
                Up to 2 tuition posts
              </p>
              <Link
                href="/sign-up"
                className="mt-4 inline-flex h-9 items-center rounded-full border border-ink/30 px-4 text-xs font-semibold text-ink transition-colors hover:bg-cream-soft"
              >
                Get Started
              </Link>
            </article>

            <article className="rounded-[20px] bg-stat-butter p-5">
              <h3 className="font-display text-lg font-bold text-ink">
                Pro Tutor
              </h3>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                $15<span className="text-sm font-semibold"> / month</span>
              </p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-ink-soft">
                Unlimited tuition posts
              </p>
              <SubscriptionAction
                requiredRole="tutor"
                subscribeLabel="Subscribe ($15/mo)"
                className="mt-4 inline-flex h-9 items-center rounded-full bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-forest disabled:cursor-wait disabled:opacity-70"
              />
            </article>

            <article className="rounded-[20px] bg-mint p-5">
              <h3 className="font-display text-lg font-bold text-ink">
                Pro Student
              </h3>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                $10<span className="text-sm font-semibold"> / month</span>
              </p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-ink-soft">
                Applications appear higher in tutor lists
              </p>
              <SubscriptionAction
                requiredRole="student"
                subscribeLabel="Subscribe ($10/mo)"
                className="mt-4 inline-flex h-9 items-center rounded-full bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-forest disabled:cursor-wait disabled:opacity-70"
              />
            </article>
          </div>
          <p className="mt-4 text-xs text-ink-soft">
            Subscriptions are billed monthly. Manage or cancel anytime through
            your billing portal.
          </p>
        </div>
      </section>

      <section className="page-container py-14 sm:py-16">
        <div className="mx-auto max-w-[760px]">
          <p className="text-center text-[10px] font-bold tracking-[0.16em] text-forest uppercase">
            FAQ
          </p>
          <h2 className="mt-2 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
            Questions, answered
          </h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {questions.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink marker:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="text-lg font-normal transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-8 text-sm leading-6 text-ink-soft">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container pb-14 sm:pb-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[24px] bg-coral px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10 sm:py-10">
          <h2 className="max-w-lg font-display text-2xl leading-tight font-bold sm:text-3xl">
            Ready to find your next mentor?
          </h2>
          <Link
            href="/sign-up"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-ink px-5 text-xs font-semibold text-white transition-colors hover:bg-forest"
          >
            Get Started
          </Link>
        </div>
      </section>

      <footer className="bg-forest-deep py-7 text-white">
        <div className="page-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo tone="light" />
            <p className="mt-1 text-[10px] text-white/70">
              Find a tutor. Start learning.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/80"
          >
            <Link href="/tuitions" className="hover:text-white">
              Browse Tuitions
            </Link>
            <Link href="/#pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="hover:text-white">
              How It Works
            </Link>
          </nav>
          <p className="text-[10px] text-white/70">
            © {new Date().getFullYear()} MentorLagbe
          </p>
        </div>
      </footer>
    </>
  )
}
