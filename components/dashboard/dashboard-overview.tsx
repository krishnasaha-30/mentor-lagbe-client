import Link from "next/link"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { AdminDashboardSummary } from "@/lib/api/admin-dashboard"
import type { TutorDashboardSummary } from "@/lib/api/tutor-dashboard"
import type { DashboardRole } from "@/lib/dashboard/nav"

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
  studentApplications,
  applicationsError,
  tutorDashboard,
  tutorDashboardError,
  adminDashboard,
  adminDashboardError,
}: {
  name: string
  email: string
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
        name={name}
        email={email}
        plan={plan}
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
      <section
        aria-label="Application summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Total Applied"
          value={statUnavailable ? "—" : (applications?.total ?? 0)}
          tone="mint"
        />
        <StatCard
          label="Accepted"
          value={statUnavailable ? "—" : (applications?.accepted ?? 0)}
          tone="butter"
        />
        <StatCard
          label="Pending"
          value={statUnavailable ? "—" : (applications?.pending ?? 0)}
          tone="peach"
        />
        <StatCard
          label="Plan"
          value={plan === "pro" ? "Pro" : "Free"}
          tone="lilac"
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
      <section
        aria-label="Tutor activity summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Tuitions Posted"
          value={statUnavailable ? "—" : (dashboard?.tuitionsPosted ?? 0)}
          tone="mint"
        />
        <StatCard
          label="Active / Approved"
          value={statUnavailable ? "—" : (dashboard?.activeApproved ?? 0)}
          tone="butter"
        />
        <StatCard
          label="Applicants"
          value={statUnavailable ? "—" : (dashboard?.applicantsCount ?? 0)}
          tone="peach"
        />
        <StatCard
          label="Plan"
          value={plan === "pro" ? "Pro" : "Free"}
          tone="lilac"
        />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-display text-xl font-bold text-ink">
          Latest applicants
        </h2>
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
                      <span className="max-w-40 truncate">
                        {application.student.name}
                      </span>
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
  name,
  email,
  plan,
  dashboard,
  dashboardError,
}: {
  name: string
  email: string
  plan: "free" | "pro"
  dashboard: AdminDashboardSummary | null
  dashboardError: boolean
}) {
  const content = overviewContent.admin
  const firstName = name.trim().split(/\s+/)[0] || name

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <section className="rounded-[20px] border border-line bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
          Admin dashboard
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-4xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
          {content.description}
        </p>
      </section>

      <section
        aria-label="Platform summary"
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Total Users"
          value={dashboardError ? "—" : (dashboard?.totalUsers ?? 0)}
          tone="mint"
        />
        <StatCard
          label="Total Tutors"
          value={dashboardError ? "—" : (dashboard?.totalTutors ?? 0)}
          tone="butter"
        />
        <StatCard
          label="Pending / Approved"
          value={
            dashboardError
              ? "— / —"
              : `${dashboard?.pendingTuitions ?? 0} / ${dashboard?.approvedTuitions ?? 0}`
          }
          tone="peach"
        />
        <StatCard label="Stripe Revenue" value="N/A" tone="lilac" />
      </section>

      <section className="mt-6 rounded-[20px] border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-ink">
          Monthly revenue
        </h2>
        <div
          role="status"
          className="mt-5 flex min-h-32 items-center justify-center rounded-xl bg-cream-soft px-5 py-8 text-center text-sm leading-6 text-ink-soft"
        >
          Stripe payment tracking is not connected yet. Revenue data will appear
          here once paid transactions are recorded.
        </div>
        {dashboardError ? (
          <p role="alert" className="mt-4 text-sm text-coral-dark">
            Platform statistics could not be loaded.
          </p>
        ) : null}
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
            <span className="font-medium text-ink">Admin</span>
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
