import Link from "next/link"

import { StatusBadge } from "@/components/dashboard/status-badge"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { DashboardRole } from "@/lib/dashboard/nav"
import { roleLabel } from "@/lib/dashboard/nav"

const overviewContent: Record<
  DashboardRole,
  {
    description: string
    sectionHeading: string
    features: { title: string; description: string; href?: string }[]
  }
> = {
  student: {
    description:
      "Find a tutor who fits your goals, then keep track of every application from your dashboard.",
    sectionHeading: "For students",
    features: [
      {
        title: "Find the right tutor",
        description:
          "Browse tuition listings by subject, class level, and learning mode.",
      },
      {
        title: "Track applications",
        description:
          "Check application decisions and manage pending requests in one place.",
      },
      {
        title: "Upgrade when ready",
        description:
          "Pro Student includes priority booking for your next tuition.",
      },
    ],
  },
  tutor: {
    description:
      "Create tuition listings, connect with students, and manage applications from one place.",
    sectionHeading: "For tutors",
    features: [
      {
        title: "Post a tuition",
        description:
          "Share the subject, class level, schedule, and fee for your tuition.",
      },
      {
        title: "Manage applicants",
        description:
          "Review student applications and update their status as you decide.",
      },
      {
        title: "Go Pro for unlimited posts",
        description: "Pro Tutor removes the free-plan tuition posting limit.",
      },
    ],
  },
  admin: {
    description:
      "Review listings, manage platform users, and keep an eye on payments and activity.",
    sectionHeading: "Platform management",
    features: [
      {
        title: "Review tuition listings",
        description:
          "Approve or reject submitted tuitions before they appear publicly.",
        href: "/dashboard/admin/tuitions",
      },
      {
        title: "Manage users",
        description: "Review accounts and update user roles when needed.",
      },
      {
        title: "Review transactions",
        description: "Keep track of paid subscriptions and platform revenue.",
      },
    ],
  },
}

export function DashboardOverview({
  name,
  email,
  role,
  plan,
}: {
  name: string
  email: string
  role: DashboardRole
  plan: "free" | "pro"
}) {
  const content = overviewContent[role]
  const firstName = name.trim().split(/\s+/)[0] || name

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <section className="rounded-[20px] border border-line bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
          {roleLabel[role]} dashboard
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-4xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
          {content.description}
        </p>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <h3 className="font-display text-xl font-bold text-ink">
            {content.sectionHeading}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {content.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[20px] border border-line bg-white p-5"
              >
                <h4 className="font-semibold text-ink">{feature.title}</h4>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {feature.description}
                </p>
                {feature.href ? (
                  <Link
                    href={feature.href}
                    className="mt-4 inline-flex text-sm font-semibold text-forest underline-offset-4 hover:underline"
                  >
                    Review submissions
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[20px] border border-line bg-white p-5">
          <h3 className="font-display text-lg font-bold text-ink">
            Your account
          </h3>
          <div className="mt-5 flex items-center gap-3">
            <UserAvatar name={name} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="truncate text-xs text-ink-soft">{email}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
            <span className="text-ink-soft">Role</span>
            <span className="font-medium text-ink">{roleLabel[role]}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-ink-soft">Plan</span>
            <StatusBadge status={plan} />
          </div>
        </aside>
      </section>
    </div>
  )
}
