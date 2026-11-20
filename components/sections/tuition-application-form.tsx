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

  if (!session) {
    return (
      <div>
        <p className="text-sm leading-6 text-ink-soft">
          Sign in with a student account to apply for this tuition.
        </p>
        <Button
          render={<Link href="/sign-in" />}
          className="mt-4 h-11 rounded-full bg-coral px-6 text-sm font-semibold text-ink hover:bg-coral-dark"
        >
          Sign in to apply
        </Button>
      </div>
    )
  }

  if (session.user.role !== "student") {
    return (
      <p className="text-sm leading-6 text-ink-soft">
        Applications are available to student accounts.
      </p>
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="application-phone">Phone number</Label>
        <Input
          id="application-phone"
          name="phone"
          type="tel"
          required
          maxLength={30}
          autoComplete="tel"
          placeholder="+880 1XXX-XXXXXX"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="application-schedule">Preferred schedule</Label>
        <Input
          id="application-schedule"
          name="preferredSchedule"
          required
          maxLength={200}
          placeholder="e.g. Weekday evenings"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="application-note">Note to the tutor (optional)</Label>
        <textarea
          id="application-note"
          name="note"
          maxLength={1000}
          rows={4}
          placeholder="Share anything else the tutor should know."
          className="mt-1.5 w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-soft/60 focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
        />
      </div>
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink"
        >
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full bg-coral px-6 text-sm font-semibold text-ink hover:bg-coral-dark"
      >
        {pending ? "Submitting..." : "Apply for this tuition"}
      </Button>
    </form>
  )
}
