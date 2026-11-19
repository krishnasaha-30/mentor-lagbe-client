"use client"

import Link from "next/link"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserRole } from "@/lib/types/user"
import { cn } from "@/lib/utils"

export type SignUpFormData = {
  name: string
  email: string
  password: string
  role: UserRole
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "tutor", label: "Tutor" },
]

export function SignUpForm({
  onSubmit,
  error,
  pending,
}: {
  onSubmit: (data: SignUpFormData) => void
  /** Message from BetterAuth, shown above the submit button. */
  error?: string | null
  pending?: boolean
}) {
  const [values, setValues] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    role: "student",
  })

  const setField =
    (field: "name" | "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }))

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <div>
      <h1 className="font-display text-[2.25rem] leading-tight font-bold tracking-[-0.02em] text-ink">
        Create your account
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            value={values.name}
            onChange={setField("name")}
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Min 6 characters"
            required
            minLength={6}
            value={values.password}
            onChange={setField("password")}
          />
        </div>

        <fieldset>
          <legend className="sr-only">Choose your account type</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                aria-pressed={values.role === role.value}
                onClick={() =>
                  setValues((prev) => ({ ...prev, role: role.value }))
                }
                className={cn(
                  "h-12 rounded-full border text-sm font-semibold transition-colors",
                  values.role === role.value
                    ? "border-ink bg-ink text-white"
                    : "border-ink/40 bg-transparent text-ink hover:bg-cream-soft"
                )}
              >
                {role.label}
              </button>
            ))}
          </div>
        </fieldset>

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
          disabled={pending}
          className="h-12 w-full rounded-full bg-coral text-sm font-semibold text-ink transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-coral underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}
