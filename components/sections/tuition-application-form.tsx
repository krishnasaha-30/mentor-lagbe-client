"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApplication } from "@/lib/api/applications"
import { authClient } from "@/lib/auth-client"

export function TuitionApplicationForm({ tuitionId }: { tuitionId: string }) {
  const { data: session, isPending } = authClient.useSession()
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const token = session?.session.token
    if (!token) {
      const message = "Sign in as a student to apply for this tuition."
      setError(message)
      toast.error(message)
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const phone = String(formData.get("phone") ?? "").trim()
    const preferredSchedule = String(
      formData.get("preferredSchedule") ?? ""
    ).trim()
    const note = String(formData.get("note") ?? "").trim()

    if (!phone || !preferredSchedule) {
      const message = "Enter your phone number and preferred schedule."
      setError(message)
      toast.error(message)
      return
    }

    setPending(true)

    try {
      await createApplication(
        tuitionId,
        { phone, preferredSchedule, note },
        token
      )
      setSubmitted(true)
      form.reset()
      toast.success("Your application has been submitted.")
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not submit your application. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setPending(false)
    }
  }

  if (isPending) {
    return (
      <p role="status" className="text-sm text-ink-soft">
        Checking your account...
      </p>
    )
  }

  if (session && session.user.role !== "student") {
    return (
      <div
        role="status"
        className="rounded-xl border border-line bg-cream-soft p-4 text-center"
      >
        <p className="text-sm font-semibold text-ink">
          Application Restricted
        </p>
        <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">
          You are signed in as a{" "}
          <span className="font-semibold capitalize text-forest">
            {session.user.role}
          </span>
          . Only registered students can apply for tuitions.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-xl bg-stat-mint px-4 py-3 text-sm leading-6 text-forest"
      >
        Your application is pending. You can track its status from your
        dashboard.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div>
        <Label htmlFor="application-phone" className="text-[10px]">
          Phone
        </Label>
        <Input
          id="application-phone"
          name="phone"
          type="tel"
          required
          maxLength={30}
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          className="mt-1 h-9 px-3 text-xs"
        />
      </div>
      <div>
        <Label htmlFor="application-schedule" className="text-[10px]">
          Preferred schedule
        </Label>
        <Input
          id="application-schedule"
          name="preferredSchedule"
          required
          maxLength={200}
          placeholder="Sat, Mon, Wed"
          className="mt-1 h-9 px-3 text-xs"
        />
      </div>
      <div>
        <Label htmlFor="application-note" className="text-[10px]">
          Learning note
        </Label>
        <textarea
          id="application-note"
          name="note"
          maxLength={1000}
          rows={3}
          placeholder="Tell the tutor your goals..."
          className="mt-1 w-full resize-y rounded-lg border border-line bg-white px-3 py-2.5 text-xs text-ink outline-none placeholder:text-ink-soft/60 focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
        />
      </div>
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-coral/40 bg-coral/10 px-3 py-2 text-xs text-ink"
        >
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-9 w-full rounded-full bg-coral px-5 text-xs font-semibold text-ink hover:bg-coral-dark"
      >
        {pending ? "Submitting..." : "Apply Now"}
      </Button>
      <p className="text-[10px] leading-4 text-ink-soft">
        Only student accounts can apply.
        {!session ? (
          <>
            {" "}
            <Link
              href="/sign-in"
              className="font-semibold text-forest underline underline-offset-2"
            >
              Sign in
            </Link>
          </>
        ) : null}
      </p>
    </form>
  )
}
