import { AdminTuitionApprovals } from "@/components/dashboard/admin-tuition-approvals"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function AdminTuitionsPage() {
  await requireDashboard(["admin"])

  return <AdminTuitionApprovals />
}
