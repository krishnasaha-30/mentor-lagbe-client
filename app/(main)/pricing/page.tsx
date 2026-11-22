import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"

import { PricingPlans } from "@/components/sections/pricing-plans"

export const metadata: Metadata = {
  title: "Pricing & Pro plans — MentorLagbe",
  description:
    "Compare the Free, Pro Tutor ($15) and Pro Student ($10) plans. Upgrade securely with Stripe whenever you are ready.",
}

const assurances = [
  {
    icon: ShieldCheck,
    title: "Secure Stripe checkout",
    description: "Payments are handled by Stripe. Card details never touch our servers.",
  },
  {
    icon: Sparkles,
    title: "Upgrade only when ready",
    description: "Start free. Pro is optional for students and tutors who want more.",
  },
] as const

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-mint py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-white/40 blur-3xl"
        />
        <div className="page-container relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
            Pricing / Pro plans
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-4xl">
            A plan for every kind of learner
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Browsing is always free. Choose Pro when you need more posts or
            higher application visibility — cancel anytime.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tuitions"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-forest"
            >
              Browse tuitions
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-10 items-center rounded-full border border-ink/20 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-cream-soft"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>

      <main className="page-container py-12 sm:py-16">
        <PricingPlans />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {assurances.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-[20px] border border-line bg-white p-5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-stat-mint text-forest">
                <item.icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-ink">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-ink-soft">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] border border-line bg-cream-soft p-6 text-center">
          <h2 className="font-display text-xl font-bold text-ink">
            Questions about billing?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
            Plans are billed monthly through Stripe. You can manage or cancel a
            subscription from the billing portal at any time.
          </p>
          <Link
            href="/#faq"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
          >
            Read the FAQ
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </main>
    </>
  )
}
