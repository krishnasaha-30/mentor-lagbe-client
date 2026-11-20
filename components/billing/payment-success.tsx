"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertCircle, Check, LoaderCircle } from "lucide-react"

import { verifyCheckoutSession, type BillingPlan } from "@/lib/api/billing"
import { authClient } from "@/lib/auth-client"

type VerificationState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "verified"; plan: BillingPlan }

export function PaymentSuccess({ sessionId }: { sessionId: string | null }) {
  const {
    data: session,
    isPending: sessionPending,
    refetch: refreshSession,
  } = authClient.useSession()
  const token = session?.session.token
  const router = useRouter()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<VerificationState>({ status: "loading" })

  useEffect(() => {
    if (sessionPending || !token || !sessionId) return

    let cancelled = false

    verifyCheckoutSession(sessionId, token)
      .then(async (plan) => {
        if (cancelled) return
        await refreshSession({ query: { disableCookieCache: true } })
        if (cancelled) return
        setState({ status: "verified", plan })
        router.refresh()
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "We could not verify the payment. Please try again.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [attempt, refreshSession, router, sessionId, sessionPending, token])

  const visibleState: VerificationState =
    !sessionPending && !token
      ? {
          status: "error",
          message:
            "Sign in with the account used for checkout to verify payment.",
        }
      : !sessionPending && token && !sessionId
        ? {
            status: "error",
            message:
              "The Checkout Session is missing. Please check your dashboard.",
          }
        : state

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-5 py-16">
      <section className="w-full rounded-[24px] border border-line bg-white p-7 text-center shadow-sm sm:p-10">
        {sessionPending || visibleState.status === "loading" ? (
          <>
            <div
              role="status"
              className="mx-auto flex size-14 items-center justify-center rounded-full bg-stat-butter text-ink"
            >
              <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold text-ink">
              Verifying your payment
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              We are confirming the Checkout Session with Stripe before
              activating your subscription.
            </p>
          </>
        ) : visibleState.status === "error" ? (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-coral/15 text-coral-dark">
              <AlertCircle aria-hidden="true" className="size-6" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold text-ink">
              Payment not verified yet
            </h1>
            <p role="alert" className="mt-3 text-sm leading-6 text-ink-soft">
              {visibleState.message}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {token && sessionId ? (
                <button
                  type="button"
                  onClick={() => {
                    setState({ status: "loading" })
                    setAttempt((value) => value + 1)
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-forest"
                >
                  Try again
                </button>
              ) : null}
              <Link
                href={token ? "/dashboard" : "/sign-in"}
                className="inline-flex h-10 items-center justify-center rounded-full border border-line px-5 text-sm font-semibold text-ink transition-colors hover:bg-cream-soft"
              >
                {token ? "Go to dashboard" : "Sign in"}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-stat-mint text-2xl font-bold text-forest">
              <Check aria-hidden="true" className="size-7" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold text-ink">
              Your Pro subscription is active
            </h1>
            <span className="mt-3 inline-flex rounded-full bg-stat-butter px-3 py-1 text-xs font-bold tracking-wide text-ink">
              PRO
            </span>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {visibleState.plan === "pro_tutor"
                ? "You can now post tuitions without the free-plan limit."
                : "Your applications will appear before free applications to tutors."}
            </p>
            <Link
              href="/dashboard"
              className="mt-7 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-forest"
            >
              Go to dashboard
            </Link>
          </>
        )}
      </section>
    </main>
  )
}
