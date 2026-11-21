import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Crown,
  GraduationCap,
  Receipt,
  Users,
  UsersRound,
} from "lucide-react"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { AdminDashboardSummary } from "@/lib/api/admin-dashboard"
import type { TutorDashboardSummary } from "@/lib/api/tutor-dashboard"
import type { DashboardRole } from "@/lib/dashboard/nav"
import { formatMinorCurrencyAmount } from "@/lib/format-currency"

type StudentDashboardApplications = {
  total: number
  accepted: number
  pending: number
  recent: {
    id: string
    title: string
    tutor: { name: string; image: string | null } | null
    monthlyFee: number | null
    status: "pending" | "accepted" | "rejected"
  }[]
}

const overviewContent: Record<
  DashboardRole,
  {
    description: string
    sectionHeading: string
    features: {
      title: string
      description: string
      href?: string
      linkLabel?: string
    }[]
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
          "Pro Student applications appear higher in tutor lists, while tutors make the final selection.",
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
        linkLabel: "Review submissions",
      },
      {
        title: "Manage users",
        description: "Review accounts and update user roles when needed.",
        href: "/dashboard/admin/users",
        linkLabel: "Manage users",
      },
      {
        title: "Review transactions",
        description: "Keep track of paid subscriptions and platform revenue.",
        href: "/dashboard/admin/transactions",
        linkLabel: "View transactions",
      },
    ],
  },
}

const welcomeContent: Record<
  DashboardRole,
  { title: string; description: string; image: string; imageAlt: string }
> = {
  student: {
    title: "Make learning progress, one connection at a time.",
    description:
      "Find a tutor who fits your goals and follow your applications from one place.",
    image: "/photos/student-learning.jpg",
    imageAlt: "Student studying at a desk",
  },
  tutor: {
    title: "Bring your expertise to students who need it.",
    description:
      "Share your tuition listings, connect with learners, and manage applications.",
    image: "/photos/tutor-teaching.jpg",
    imageAlt: "Tutor helping a student learn",
  },
  admin: {
    title: "Keep the learning community moving forward.",
    description:
      "Review listings, support users, and keep track of platform activity.",
    image: "/photos/classroom.jpg",
    imageAlt: "Students learning together in a classroom",
  },
}

function DashboardWelcome({ role }: { role: DashboardRole }) {
  const content = welcomeContent[role]
  const Icon =
    role === "student"
      ? GraduationCap
      : role === "tutor"
        ? BookOpenCheck
        : UsersRound

  return (
    <section className="mb-4 grid overflow-hidden rounded-[20px] border border-line bg-white md:grid-cols-[minmax(0,1fr)_220px]">
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-stat-mint text-forest">
          <Icon aria-hidden="true" className="size-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-forest uppercase">
            Welcome to your {role} workspace
          </p>
          <h2 className="mt-1 font-display text-lg leading-snug font-bold tracking-[-0.02em] text-ink sm:text-xl">
            {content.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-ink-soft sm:text-sm">
            {content.description}
          </p>
        </div>
      </div>
      <div className="relative min-h-[112px] md:min-h-[150px]">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          sizes="(min-width: 768px) 220px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent md:bg-gradient-to-l md:from-transparent md:to-white/10" />
      </div>
    </section>
  )
}

export function DashboardOverview({
  role,
  plan,
  studentApplications,
  applicationsError,
  tutorDashboard,
  tutorDashboardError,
  adminDashboard,
  adminDashboardError,
}: {
  role: DashboardRole
  plan: "free" | "pro"
  studentApplications: StudentDashboardApplications | null
  applicationsError: boolean
  tutorDashboard: TutorDashboardSummary | null
  tutorDashboardError: boolean
  adminDashboard: AdminDashboardSummary | null
  adminDashboardError: boolean
}) {
  if (role === "student") {
    return (
      <StudentDashboardOverview
        plan={plan}
        applications={studentApplications}
        applicationsError={applicationsError}
      />
    )
  }
  if (role === "tutor") {
    return (
      <TutorDashboardOverview
        plan={plan}
        dashboard={tutorDashboard}
        dashboardError={tutorDashboardError}
      />
    )
  }

  if (role === "admin") {
    return (
      <AdminDashboardOverview
        dashboard={adminDashboard}
        dashboardError={adminDashboardError}
      />
    )
  }
}

function StudentDashboardOverview({
  plan,
  applications,
  applicationsError,
}: {
  plan: "free" | "pro"
  applications: StudentDashboardApplications | null
  applicationsError: boolean
}) {
  const statUnavailable = applicationsError

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <DashboardWelcome role="student" />
      <section
        aria-label="Application summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Total Applied"
          value={statUnavailable ? "—" : (applications?.total ?? 0)}
          tone="mint"
          icon={BookOpenCheck}
        />
        <StatCard
          label="Accepted"
          value={statUnavailable ? "—" : (applications?.accepted ?? 0)}
          tone="butter"
          icon={CheckCircle2}
        />
        <StatCard
          label="Pending"
          value={statUnavailable ? "—" : (applications?.pending ?? 0)}
          tone="peach"
          icon={Clock3}
        />
        <StatCard
          label="Plan"
          value={plan === "pro" ? "Pro" : "Free"}
          tone="lilac"
          icon={Crown}
        />
      </section>

      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">
            Recent applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-sm font-semibold text-forest underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {applicationsError ? (
          <div
            role="alert"
            className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
          >
            Applications could not be loaded. Please try again later.
          </div>
        ) : (
          <DataTable
            columns={["Tuition", "Tutor", "Fee", "Status"]}
            isEmpty={!applications || applications.recent.length === 0}
            emptyMessage="You have not applied to any tuitions yet."
          >
            {applications?.recent.map((application) => (
              <DataRow key={application.id}>
                <td className="px-5 py-4 font-medium text-ink sm:px-6">
                  {application.title}
                </td>
                <td className="px-5 py-4 sm:px-6">
                  {application.tutor ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={application.tutor.name}
                        image={application.tutor.image}
                        size="sm"
                      />
                      <span className="max-w-40 truncate">
                        {application.tutor.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-ink-soft">Unavailable</span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-ink-soft sm:px-6">
                  {application.monthlyFee === null
                    ? "—"
                    : `৳${new Intl.NumberFormat("en-BD", {
                        maximumFractionDigits: 0,
                      }).format(application.monthlyFee)}`}
                </td>
                <td className="px-5 py-4 sm:px-6">
                  <StatusBadge status={application.status} />
                </td>
              </DataRow>
            ))}
          </DataTable>
        )}
      </section>
    </div>
  )
}

function TutorDashboardOverview({
  plan,
  dashboard,
  dashboardError,
}: {
  plan: "free" | "pro"
  dashboard: TutorDashboardSummary | null
  dashboardError: boolean
}) {
  const statUnavailable = dashboardError

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <DashboardWelcome role="tutor" />
      <section
        aria-label="Tutor activity summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Tuitions Posted"
          value={statUnavailable ? "—" : (dashboard?.tuitionsPosted ?? 0)}
          tone="mint"
          icon={BookOpenCheck}
        />
        <StatCard
          label="Active / Approved"
          value={statUnavailable ? "—" : (dashboard?.activeApproved ?? 0)}
          tone="butter"
          icon={CheckCircle2}
        />
        <StatCard
          label="Applicants"
          value={statUnavailable ? "—" : (dashboard?.applicantsCount ?? 0)}
          tone="peach"
          icon={UsersRound}
        />
        <StatCard
          label="Plan"
          value={plan === "pro" ? "Pro" : "Free"}
          tone="lilac"
          icon={Crown}
        />
      </section>

      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">
            Latest applicants
          </h2>
          <Link
            href="/dashboard/applicants"
            className="text-sm font-semibold text-forest underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        {dashboardError ? (
          <div
            role="alert"
            className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
          >
            Applicant activity could not be loaded. Please try again later.
          </div>
        ) : (
          <DataTable
            columns={["Student", "Tuition", "Status"]}
            isEmpty={!dashboard || dashboard.latestApplicants.length === 0}
            emptyMessage="No students have applied to your tuitions yet."
          >
            {dashboard?.latestApplicants.map((application) => (
              <DataRow key={application.id}>
                <td className="px-5 py-4 sm:px-6">
                  {application.student ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={application.student.name}
                        image={application.student.image}
                        size="sm"
                      />
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="max-w-40 truncate">
                          {application.student.name}
                        </span>
                        {application.student.plan === "pro" ? (
                          <span className="shrink-0 rounded-full bg-stat-butter px-2 py-0.5 text-[10px] font-semibold text-ink">
                            Pro
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <span className="text-ink-soft">Student unavailable</span>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-ink sm:px-6">
                  {application.tuitionTitle}
                </td>
                <td className="px-5 py-4 sm:px-6">
                  <StatusBadge status={application.status} />
                </td>
              </DataRow>
            ))}
          </DataTable>
        )}
      </section>
    </div>
  )
}

function AdminDashboardOverview({
  dashboard,
  dashboardError,
}: {
  dashboard: AdminDashboardSummary | null
  dashboardError: boolean
}) {
  const content = overviewContent.admin
  const quickActionIcons = [ClipboardCheck, Users, Receipt]
  const revenueValue = dashboardError
    ? "—"
    : dashboard?.revenue.length === 1
      ? formatMinorCurrencyAmount(
          dashboard.revenue[0].amountMinor,
          dashboard.revenue[0].currency
        )
      : dashboard?.revenue.length
        ? `${dashboard.revenue.length} currencies`
        : "$0.00"

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <DashboardWelcome role="admin" />
      <section
        aria-label="Platform summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Total Users"
          value={dashboardError ? "—" : (dashboard?.totalUsers ?? 0)}
          tone="mint"
          icon={Users}
        />
        <StatCard
          label="Total Tutors"
          value={dashboardError ? "—" : (dashboard?.totalTutors ?? 0)}
          tone="butter"
          icon={GraduationCap}
        />
        <StatCard
          label="Pending / Approved"
          value={
            dashboardError
              ? "— / —"
              : `${dashboard?.pendingTuitions ?? 0} / ${dashboard?.approvedTuitions ?? 0}`
          }
          tone="peach"
          icon={ClipboardCheck}
        />
        <StatCard
          label="Stripe Revenue"
          value={revenueValue}
          tone="lilac"
          icon={Receipt}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[20px] border border-line bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-ink">
              Paid subscription revenue
            </h2>
            <Link
              href="/dashboard/admin/transactions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
            >
              View all
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <p className="mt-2 text-xs leading-5 text-ink-soft">
            Gross paid invoice totals grouped by currency. Refunds and Stripe
            fees are not deducted.
          </p>

          {dashboardError ? (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-coral/40 bg-cream-soft px-5 py-8 text-center text-sm text-coral-dark"
            >
              Platform statistics could not be loaded.
            </div>
          ) : dashboard?.revenue.length ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {dashboard.revenue.map((total) => (
                <li
                  key={total.currency}
                  className="rounded-xl bg-cream-soft px-4 py-4"
                >
                  <p className="font-display text-2xl font-bold text-ink">
                    {formatMinorCurrencyAmount(
                      total.amountMinor,
                      total.currency
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {total.paymentCount} paid{" "}
                    {total.paymentCount === 1 ? "invoice" : "invoices"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div
              role="status"
              className="mt-5 rounded-xl bg-cream-soft px-5 py-8 text-center text-sm text-ink-soft"
            >
              No paid subscription invoices have been recorded yet.
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold text-ink">
            Quick actions
          </h2>
          <div className="mt-4 space-y-2.5">
            {content.features.map((feature, index) => {
              const Icon = quickActionIcons[index % quickActionIcons.length]

              return (
                <Link
                  key={feature.title}
                  href={feature.href ?? "/dashboard"}
                  className="group flex items-center gap-3 rounded-xl border border-line/70 bg-cream/40 px-3.5 py-3 transition-colors hover:border-forest/25 hover:bg-cream"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-forest shadow-sm">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {feature.title}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {feature.description}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
