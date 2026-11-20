import { AdminTransactions } from "@/components/dashboard/admin-transactions"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function AdminTransactionsPage() {
  await requireDashboard(["admin"])

  return <AdminTransactions />
}
