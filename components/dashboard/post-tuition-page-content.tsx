import { PostTuitionForm } from "@/components/dashboard/post-tuition-form"
import { API_BASE_URL, getToken } from "@/lib/core/server"
import type { TutorPostUsage } from "@/lib/types/tuition"

function isTutorPostUsage(value: unknown): value is TutorPostUsage {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const usage = value as Record<string, unknown>

  return (
    (usage.plan === "free" || usage.plan === "pro") &&
    typeof usage.postsUsed === "number" &&
    (usage.postsLimit === null || typeof usage.postsLimit === "number") &&
    typeof usage.canCreate === "boolean"
  )
}

/**
 * Shared server content for both `post-tuition` routes:
 * `/dashboard/tuitions/new` and `/dashboard/tutor/post-tuition`.
 */
export async function PostTuitionPageContent() {
  const token = await getToken()

  let usage: TutorPostUsage | null = null
  let usageError = false

  try {
    const response = await fetch(`${API_BASE_URL}/api/tuitions/mine/usage`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Usage request failed with status ${response.status}.`)
    }

    const data: unknown = await response.json()

    if (!isTutorPostUsage(data)) {
      throw new Error("The server returned invalid tuition usage data.")
    }

    usage = data
  } catch (error) {
    console.error("Could not load tutor tuition usage:", error)
    usageError = true
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <PostTuitionForm usage={usage} usageError={usageError} />
    </div>
  )
}
