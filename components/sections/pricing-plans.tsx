import Link from "next/link"
import { Check } from "lucide-react"

import { SubscriptionAction } from "@/components/billing/subscription-action"

/**
 * Free / Pro Tutor / Pro Student comparison. Shared by the home page
 * pricing section and the dedicated `/pricing` route.
 */
export function PricingPlans() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="flex h-full flex-col rounded-[24px] border border-line bg-white p-6">
          <h3 className="font-display text-lg font-bold text-ink">Free</h3>
          <p className="mt-3 font-display text-4xl font-bold text-ink">$0</p>
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

        <article className="flex h-full flex-col rounded-[24px] bg-stat-butter p-6">
          <h3 className="font-display text-lg font-bold text-ink">
            Pro Student
          </h3>
          <p className="mt-3 font-display text-4xl font-bold text-ink">
            $10
            <span className="text-sm font-semibold text-ink/60"> / month</span>
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
      </div>

      <p className="mt-5 text-center text-xs text-ink-soft">
        Subscriptions are billed monthly. Manage or cancel anytime through your
        billing portal.
      </p>
    </>
  )
}
