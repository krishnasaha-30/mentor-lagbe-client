import { UpdateProfileForm } from "@/components/dashboard/update-profile-form"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function ProfilePage() {
  await requireDashboard()

  return <UpdateProfileForm />
}
