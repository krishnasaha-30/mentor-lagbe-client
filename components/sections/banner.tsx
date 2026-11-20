import { ArrowRight, Check, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { HeroCollage } from "@/components/sections/hero-collage"

const popularSubjects = [
  { label: "Math", href: "/tuitions?subject=Math" },
  { label: "Physics", href: "/tuitions?subject=Physics" },
  { label: "IELTS", href: "/tuitions?subject=IELTS" },
  { label: "Programming", href: "/tuitions?subject=Programming" },
]

const trustAvatars = [
  { src: "/photos/avatar-1.jpg", alt: "" },
  { src: "/photos/avatar-2.jpg", alt: "" },
  { src: "/photos/avatar-3.jpg", alt: "" },
]

export function Banner({ tutorCount }: { tutorCount?: number }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Soft brand glows behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-28 size-[420px] rounded-full bg-mint/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-24 size-[380px] rounded-full bg-peach/60 blur-3xl"
      />

      <div className="page-container relative grid items-center gap-14 py-12 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-20 xl:gap-16">
        <div className="hero-copy-enter relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white/80 px-3.5 py-2 text-[11px] font-semibold text-forest shadow-sm backdrop-blur sm:text-xs">
            <span className="pulse-dot size-2 rounded-full bg-coral" />
            Admin-reviewed tuition listings
          </span>

          <h1 className="mt-6 max-w-[640px] font-display text-[2.75rem] leading-[1.02] font-bold tracking-[-0.035em] text-forest sm:text-[3.6rem] lg:text-[4.1rem]">
            Find the tutor who makes learning feel{" "}
            <span className="relative whitespace-nowrap text-coral italic">
              simple.
              <svg
                aria-hidden="true"
                viewBox="0 0 220 14"
                className="absolute -bottom-2 left-0 h-3 w-full text-coral/35"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 10c48-7 122-9 214-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-[520px] text-[15px] leading-7 text-ink-soft sm:text-base">
            Browse reviewed batches, compare fees and schedules, and apply to
            the tuition that fits your goals — online or in person.
          </p>

          <form
            role="search"
            action="/tuitions"
            className="mt-7 flex w-full max-w-[560px] flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-[0_20px_55px_-38px_rgba(20,35,29,0.55)] transition-shadow focus-within:shadow-[0_24px_60px_-34px_rgba(20,35,29,0.45)] sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-1.5 sm:pl-4"
          >
            <label className="flex h-11 min-w-0 flex-1 items-center gap-3 px-2 sm:px-0">
              <Search
                aria-hidden="true"
                className="size-[18px] shrink-0 text-ink-soft"
              />
              <input
                type="search"
                name="q"
                aria-label="Search tuitions"
                placeholder="What subject are you looking for?"
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/70"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/25 sm:w-auto"
            >
              Find a tutor
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-ink-soft">Popular:</span>
            {popularSubjects.map((subject) => (
              <Link
                key={subject.label}
                href={subject.href}
                className="rounded-full border border-line bg-white/70 px-3 py-1.5 font-medium text-ink transition-colors hover:border-forest/30 hover:bg-white hover:text-forest"
              >
                {subject.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {trustAvatars.map((avatar) => (
                  <span
                    key={avatar.src}
                    className="relative size-9 overflow-hidden rounded-full ring-2 ring-cream"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <p className="max-w-[220px] text-xs leading-5 text-ink-soft">
                <span className="block font-semibold text-ink">
                  {tutorCount && tutorCount > 0
                    ? `${tutorCount} verified tutors`
                    : "Verified tutors"}
                </span>
                already teaching on MentorLagbe
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Check aria-hidden="true" className="size-3.5 text-forest" />
                Free to join
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check aria-hidden="true" className="size-3.5 text-forest" />
                No hidden fees
              </span>
            </div>
          </div>
        </div>

        <HeroCollage />
      </div>
    </section>
  )
}
