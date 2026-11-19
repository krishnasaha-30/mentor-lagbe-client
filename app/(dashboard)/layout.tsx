import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireDashboard } from "@/lib/dashboard/guard"

/**
 * Auth gate for the whole dashboard. The role read here decides which
 * sidebar and which page title every child page gets.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { session, role } = await requireDashboard()

  return (
    <DashboardShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role,
      }}
    >
      {children}
    </DashboardShell>
  )
}
