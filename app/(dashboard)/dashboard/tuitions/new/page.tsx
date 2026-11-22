import { PostTuitionPageContent } from "@/components/dashboard/post-tuition-page-content"
import { requireDashboard } from "@/lib/dashboard/guard"

export default async function PostTuitionPage() {
  await requireDashboard(["tutor"])

  return <PostTuitionPageContent />
}
