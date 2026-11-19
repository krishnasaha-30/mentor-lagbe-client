"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  SignUpForm,
  type SignUpFormData,
} from "@/components/auth/signup-form"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSignUp(data: SignUpFormData) {
    setError(null)
    setPending(true)

    const { error: signUpError } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      callbackURL: "/",
    })

    setPending(false)

    if (signUpError) {
      // e.g. "User already exists. Use another email."
      setError(signUpError.message ?? "Something went wrong. Please try again.")
      return
    }

    // Refresh so server components pick up the new session cookie, then go home.
    router.push("/")
    router.refresh()
  }

  return (
    <SignUpForm onSubmit={handleSignUp} error={error} pending={pending} />
  )
}
