"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createBillingPortalSession,
  createCheckoutSession,
} from "@/lib/api/billing"
import { authClient } from "@/lib/auth-client"

export function SubscriptionAction({
  requiredRole,
  subscribeLabel,
  className,
}: {
  requiredRole: "student" | "tutor"
  subscribeLabel: string
  className: string
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const token = session?.session.token
  const isPro = session?.user.plan === "pro"

  async function handleClick() {
    if (sessionPending || isLoading) return

    if (!session || !token) {
      router.push("/sign-in")
      return
    }

    if (session.user.role !== requiredRole) {
      toast.error(
        requiredRole === "tutor"
          ? "The Pro Tutor plan is only available to tutors."
          : "The Pro Student plan is only available to students."
      )
      return
    }

    setIsLoading(true)

    try {
      const url = isPro
        ? await createBillingPortalSession(token)
        : await createCheckoutSession(
            requiredRole === "tutor" ? "pro_tutor" : "pro_student",
            token
          )
      window.location.assign(url)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not open Stripe billing. Please try again."
      )
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={sessionPending || isLoading}
      className={`${className} focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:outline-none`}
    >
      {isLoading
        ? "Opening Stripe..."
        : isPro
          ? "Manage subscription"
          : subscribeLabel}
    </button>
  )
}
