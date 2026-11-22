"use client"

import Link from "next/link"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type SignInFormData = {
  email: string
  password: string
}

export function SignInForm({
  onSubmit,
  onGoogle,
  error,
  pending,
  googlePending,
}: {
  onSubmit: (data: SignInFormData) => void
  onGoogle: () => void
  /** Message from BetterAuth, shown above the buttons. */
  error?: string | null
  pending?: boolean
  googlePending?: boolean
}) {
  const [values, setValues] = useState<SignInFormData>({
    email: "",
    password: "",
  })

  const setField =
    (field: keyof SignInFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }))

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  const busy = pending || googlePending

  return (
    <div>
      <h1 className="font-display text-[2.25rem] leading-tight font-bold tracking-[-0.02em] text-ink">
        Welcome back
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={values.email}
            onChange={setField("email")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            value={values.password}
            onChange={setField("password")}
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

        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>

        {/* <button
          type="button"
          onClick={onGoogle}
          disabled={busy}
          className="h-12 w-full rounded-full border border-ink/40 bg-transparent text-sm font-semibold text-ink transition-colors hover:bg-cream-soft disabled:cursor-not-allowed disabled:opacity-70"
        >
          {googlePending ? "Connecting to Google..." : "Continue with Google"}
        </button> */}
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        New here?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-coral underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}
