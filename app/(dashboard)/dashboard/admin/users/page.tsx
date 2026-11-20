import { AdminUsers } from "@/components/dashboard/admin-users"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function AdminUsersPage() {
  await requireDashboard(["admin"])

  return <AdminUsers />
}
