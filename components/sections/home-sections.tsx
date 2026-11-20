import {
  ArrowRight,
  ArrowUpRight,
  Check,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { SubscriptionAction } from "@/components/billing/subscription-action"
import { Logo } from "@/components/layout/logo"
import { CountUp } from "@/components/motion/count-up"
import { Reveal } from "@/components/motion/reveal"
import { TuitionCard } from "@/components/sections/tuition-card"
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

const features = [
  {
    icon: ShieldCheck,
    title: "Admin-reviewed listings",
    description:
      "Every tuition is checked before it goes live, so you browse real batches only.",
    tone: "bg-mint",
  },
  {
    icon: SlidersHorizontal,
    title: "Filters that actually help",
    description:
      "Search by subject, class level, mode and monthly fee in a single pass.",
    tone: "bg-stat-butter",
  },
  {
    icon: MessageSquare,
    title: "One short application",
    description:
      "Phone, preferred schedule and a note. Tutors reply with a decision.",
    tone: "bg-peach",
  },
] as const

const steps = [
  {
    number: "1",
    title: "Create an account",
    description: "Sign up in seconds as a student or a tutor.",
  },
  {
    number: "2",
    title: "Post or search",
    description: "Tutors list batches; students filter by what matters.",
  },
  {
    number: "3",
    title: "Apply in minutes",
    description: "One short form. No back-and-forth over chat.",
  },
  {
    number: "4",
    title: "Start learning",
    description: "Tutors accept, and the first session is booked.",
  },
] as const

const testimonials = [
  {
    quote: "I found a great math tutor and started classes the same week.",
    name: "Ayesha R.",
    role: "Student",
    photo: "/photos/avatar-1.jpg",
  },
  {
    quote: "Posting my tuition helped me connect with families in my area.",
    name: "Kamal H.",
    role: "Tutor",
    photo: "/photos/avatar-2.jpg",
  },
  {
    quote: "The subject and budget filters made the search much easier.",
    name: "Shafin M.",
    role: "Parent",
    photo: "/photos/avatar-3.jpg",
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

function SubjectStrip({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {subjects.map((subject) => (
        <div key={subject.name} className="flex items-center gap-10">
          <Link
            href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
            tabIndex={duplicate ? -1 : undefined}
            className="text-sm font-semibold whitespace-nowrap transition-colors hover:text-mint"
          >
            {subject.name}
          </Link>
          <span className="size-1.5 rounded-full bg-stat-butter/70" />
        </div>
      ))}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <Reveal className="max-w-xl">
      <p className="text-[10px] font-bold tracking-[0.18em] text-forest uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-[2rem]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{description}</p>
    </Reveal>
  )
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
    { value: stats?.subjects, label: "Subjects covered" },
    { value: stats?.acceptedApplications, label: "Accepted applications" },
  ]

  return (
    <>
      {/* Scrolling subject strip */}
      <div className="marquee marquee-mask overflow-hidden border-y border-white/10 bg-forest-deep py-3.5 text-white">
        <div className="marquee-track flex w-max">
          <SubjectStrip />
          <SubjectStrip duplicate />
        </div>
      </div>

      {/* Subjects */}
      <section
        id="subjects"
        className="page-container scroll-mt-24 py-14 sm:py-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Top subjects"
            title="Explore by subject"
            description="Start from the subject you need help with, then narrow it down by class level and mode."
          />
          <Reveal delay={100}>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
            >
              All listings
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {subjects.map((subject, index) => (
            <Reveal key={subject.name} delay={index * 60}>
              <Link
                href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                className={`group relative flex min-h-28 h-full flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_-26px_rgba(20,35,29,0.6)] ${subject.tone}`}
              >
                <span className="font-display text-2xl font-bold text-ink">
                  {subject.mark}
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-ink">
                    {subject.name}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-ink/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why MentorLagbe */}
      <section className="page-container pb-14 sm:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[28px] border-[6px] border-white bg-cream shadow-[0_30px_70px_-45px_rgba(20,35,29,0.6)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/photos/study-group.jpg"
                  alt="Three students collaborating around laptops"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/45 to-transparent" />
              </div>
            </div>

            <div className="float-slow absolute -right-2 -bottom-6 rounded-2xl border border-line/60 bg-white px-5 py-4 shadow-[0_20px_45px_-28px_rgba(20,35,29,0.55)] sm:-right-5">
              <p className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
                <GraduationCap aria-hidden="true" className="size-6 text-coral" />
                1 : 1
              </p>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                Guidance that fits you
              </p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Why MentorLagbe"
              title="Choose with confidence, not guesswork."
              description="We keep the process short and the information clear, so you can decide in minutes instead of days."
            />

            <ul className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 90}>
                  <li className="flex gap-4 rounded-2xl border border-line bg-white/70 p-4 transition-shadow hover:shadow-[0_16px_35px_-30px_rgba(20,35,29,0.55)]">
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-xl text-forest ${feature.tone}`}
                    >
                      <feature.icon aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-ink">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-ink-soft">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured tuitions */}
      <section className="bg-cream-soft/70 py-14 sm:py-20">
        <div className="page-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Latest approved tuitions"
              description="Fresh listings reviewed by our admin team, updated as tutors post."
            />
            <Reveal delay={100}>
              <Link
                href="/tuitions"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-xs font-semibold text-white transition-colors hover:bg-forest"
              >
                Browse all
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Reveal>
          </div>

          {tuitionsError ? (
            <div
              role="alert"
              className="mt-8 rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
            >
              Latest tuitions could not be loaded. You can still browse all
              listings.
            </div>
          ) : tuitions.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tuitions.map((tuition, index) => (
                <Reveal key={tuition.id} delay={Math.min(index, 5) * 70}>
                  <TuitionCard tuition={tuition} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[20px] border border-line bg-white px-6 py-12 text-center">
              <p className="font-semibold text-ink">No approved tuitions yet</p>
              <p className="mt-2 text-sm text-ink-soft">
                Check back soon or explore the full listings page.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-white py-14 sm:py-20"
      >
        <div className="page-container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-[28px] border-[6px] border-white bg-cream shadow-[0_30px_70px_-45px_rgba(20,35,29,0.6)]">
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/photos/classroom.jpg"
                  alt="A teacher leading a class of students"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-forest-deep/10 to-transparent" />
                <figure className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <blockquote className="font-display text-xl leading-snug font-semibold italic">
                    “The right batch changes how a student feels about the
                    subject.”
                  </blockquote>
                  <figcaption className="mt-3 text-[10px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                    A MentorLagbe tutor
                  </figcaption>
                </figure>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="How it works"
              title="Four calm steps to better learning."
              description="No long forms, no waiting for a callback. Everything happens in your dashboard."
            />

            <ol className="mt-8 space-y-3">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 80}>
                  <li className="flex items-start gap-4 rounded-2xl border border-transparent px-2 py-3 transition-colors hover:border-line hover:bg-cream/60">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full font-display text-base font-bold text-ink ${
                        index === 0
                          ? "bg-stat-butter"
                          : index === 1
                            ? "bg-mint"
                            : index === 2
                              ? "bg-peach"
                              : "bg-lilac"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-ink-soft">
                        {step.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Audience cards */}
      <section className="page-container py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Link
              href="/tuitions"
              className="group relative block min-h-[330px] overflow-hidden rounded-[28px] bg-forest"
            >
              <Image
                src="/photos/student-learning.jpg"
                alt="A student taking notes while studying"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/35 to-forest-deep/5" />
              <div className="relative flex h-full min-h-[330px] flex-col justify-end p-7 text-white">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase backdrop-blur">
                  <Users aria-hidden="true" className="size-3.5" />
                  For students
                </span>
                <h2 className="mt-4 max-w-sm font-display text-2xl leading-tight font-bold sm:text-3xl">
                  Learn with someone who fits you.
                </h2>
                <p className="mt-2 max-w-sm text-sm text-white/80">
                  Filter, compare, and apply to a batch in minutes.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Find a tutor
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <Link
              href="/sign-up"
              className="group relative block min-h-[330px] overflow-hidden rounded-[28px] bg-forest"
            >
              <Image
                src="/photos/tutor-teaching.jpg"
                alt="A tutor teaching a classroom of students"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/35 to-forest-deep/5" />
              <div className="relative flex h-full min-h-[330px] flex-col justify-end p-7 text-white">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase backdrop-blur">
                  <GraduationCap aria-hidden="true" className="size-3.5" />
                  For tutors
                </span>
                <h2 className="mt-4 max-w-sm font-display text-2xl leading-tight font-bold sm:text-3xl">
                  Grow your tuition batch.
                </h2>
                <p className="mt-2 max-w-sm text-sm text-white/80">
                  Post listings and manage every applicant in one place.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Become a tutor
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section
        aria-label="MentorLagbe platform statistics"
        className="relative overflow-hidden bg-forest py-12 text-white sm:py-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-forest-active/60 blur-3xl"
        />
        <div className="page-container relative">
          {statsError ? (
            <p role="status" className="mb-6 text-center text-xs text-white/75">
              Platform statistics are temporarily unavailable.
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="font-display text-4xl font-bold text-stat-butter sm:text-5xl">
                  {metric.value === undefined ? (
                    "—"
                  ) : (
                    <CountUp value={metric.value} />
                  )}
                </p>
                <p className="mt-2 text-[11px] font-medium tracking-wide text-white/80">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-container py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by students and tutors"
            description="A few words from the people using MentorLagbe every day."
          />
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink">
              <Star
                aria-hidden="true"
                className="size-4 fill-stat-butter text-stat-butter"
              />
              Sample feedback
            </div>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 90}>
              <figure className="flex h-full flex-col rounded-[22px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-32px_rgba(20,35,29,0.55)]">
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      aria-hidden="true"
                      className="size-3.5 fill-stat-butter text-stat-butter"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-6 text-ink-soft">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="relative size-10 overflow-hidden rounded-full bg-cream-soft">
                    <Image
                      src={testimonial.photo}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 bg-white py-14 sm:py-20">
        <div className="page-container">
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <p className="text-[10px] font-bold tracking-[0.18em] text-forest uppercase">
                Pricing
              </p>
              <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-[2rem]">
                Upgrade when you are ready
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Free to start. Pro plans unlock more for students and tutors.
              </p>
            </Reveal>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            <Reveal>
              <article className="flex h-full flex-col rounded-[24px] border border-line bg-white p-6">
                <h3 className="font-display text-lg font-bold text-ink">
                  Free
                </h3>
                <p className="mt-3 font-display text-4xl font-bold text-ink">
                  $0
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  Everything you need to get started
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-xs text-ink-soft">
                  {[
                    "Browse every listing",
                    "Up to 2 tuition posts",
                    "Standard application visibility",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-forest"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-ink/25 px-5 text-xs font-semibold text-ink transition-colors hover:bg-cream-soft"
                >
                  Get started
                </Link>
              </article>
            </Reveal>

            <Reveal delay={90}>
              <article className="relative flex h-full flex-col rounded-[24px] bg-forest p-6 text-white">
                <span className="absolute top-5 right-5 rounded-full bg-stat-butter px-2.5 py-1 text-[9px] font-bold tracking-wide text-ink uppercase">
                  Most popular
                </span>
                <h3 className="font-display text-lg font-bold">Pro Tutor</h3>
                <p className="mt-3 font-display text-4xl font-bold">
                  $15
                  <span className="text-sm font-semibold text-white/70">
                    {" "}
                    / month
                  </span>
                </p>
                <p className="mt-1 text-xs text-white/70">
                  For tutors who post regularly
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-xs text-white/85">
                  {[
                    "Unlimited tuition posts",
                    "Priority placement on browse",
                    "Manage everything in one dashboard",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-stat-butter"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <SubscriptionAction
                  requiredRole="tutor"
                  subscribeLabel="Subscribe ($15/mo)"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-stat-butter px-5 text-xs font-semibold text-ink transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70"
                />
              </article>
            </Reveal>

            <Reveal delay={180}>
              <article className="flex h-full flex-col rounded-[24px] bg-stat-butter p-6">
                <h3 className="font-display text-lg font-bold text-ink">
                  Pro Student
                </h3>
                <p className="mt-3 font-display text-4xl font-bold text-ink">
                  $10
                  <span className="text-sm font-semibold text-ink/60">
                    {" "}
                    / month
                  </span>
                </p>
                <p className="mt-1 text-xs text-ink/60">
                  For students who want to stand out
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-xs text-ink/75">
                  {[
                    "Applications appear higher in lists",
                    "Apply to unlimited tuitions",
                    "Keep your profile up to date",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-forest"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <SubscriptionAction
                  requiredRole="student"
                  subscribeLabel="Subscribe ($10/mo)"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-xs font-semibold text-white transition-colors hover:bg-forest disabled:cursor-wait disabled:opacity-70"
                />
              </article>
            </Reveal>
          </div>

          <p className="mt-5 text-center text-xs text-ink-soft">
            Subscriptions are billed monthly. Manage or cancel anytime through
            your billing portal.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-container py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.18em] text-forest uppercase">
              FAQ
            </p>
            <h2 className="mt-2 font-display text-2xl leading-tight font-bold text-ink sm:text-[2rem]">
              Questions, answered
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
              Still unsure about something? Sign in and your dashboard has the
              full picture.
            </p>
            <Link
              href="/sign-in"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
            >
              Go to your dashboard
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="divide-y divide-line rounded-[24px] border border-line bg-white px-6">
              {questions.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink marker:hidden">
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-base font-normal transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-sm leading-6 text-ink-soft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="page-container pb-14 sm:pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-forest-deep">
            <Image
              src="/photos/tuition-class.jpg"
              alt=""
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-forest-deep/82" />
            <div className="relative px-6 py-14 text-center text-white sm:px-12 sm:py-16">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-stat-butter uppercase">
                <Sparkles aria-hidden="true" className="size-3.5" />
                Your next step
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl leading-tight font-bold sm:text-4xl">
                Ready to find your next mentor?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
                Join as a student to apply, or as a tutor to list your first
                tuition today.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center rounded-full bg-coral px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-coral-dark"
                >
                  Get started free
                </Link>
                <Link
                  href="/tuitions"
                  className="inline-flex h-11 items-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse tuitions
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-forest-deep pt-12 pb-7 text-white">
        <div className="page-container">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo tone="light" />
              <p className="mt-3 max-w-xs text-xs leading-6 text-white/65">
                A calmer way to find tuition in Bangladesh. Reviewed listings,
                short applications, and a dashboard for everything else.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-white/45 uppercase">
                Explore
              </p>
              <nav
                aria-label="Footer explore"
                className="mt-3 flex flex-col gap-2 text-xs text-white/80"
              >
                <Link href="/tuitions" className="hover:text-white">
                  Browse Tuitions
                </Link>
                <Link href="/#subjects" className="hover:text-white">
                  Subjects
                </Link>
                <Link href="/#pricing" className="hover:text-white">
                  Pricing
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-white/45 uppercase">
                Platform
              </p>
              <nav
                aria-label="Footer platform"
                className="mt-3 flex flex-col gap-2 text-xs text-white/80"
              >
                <Link href="/#how-it-works" className="hover:text-white">
                  How It Works
                </Link>
                <Link href="/sign-up" className="hover:text-white">
                  Create an account
                </Link>
                <Link href="/sign-in" className="hover:text-white">
                  Sign In
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-white/45 uppercase">
                Support
              </p>
              <nav
                aria-label="Footer support"
                className="mt-3 flex flex-col gap-2 text-xs text-white/80"
              >
                <Link href="/#pricing" className="hover:text-white">
                  Plans &amp; billing
                </Link>
                <Link href="/tuitions" className="hover:text-white">
                  Find a tutor
                </Link>
                <Link href="/sign-up" className="hover:text-white">
                  Become a tutor
                </Link>
              </nav>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-[10px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
            <p>Photography by Unsplash contributors.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
