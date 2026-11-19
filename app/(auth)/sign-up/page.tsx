"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

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
      callbackURL: "/dashboard",
    })

    setPending(false)

    if (signUpError) {
      // e.g. "User already exists. Use another email."
      const message =
        signUpError.message ?? "Something went wrong. Please try again."
      setError(message)
      toast.error(message)
      return
    }

    toast.success("Account created. Welcome to MentorLagbe!")
    // Refresh so server components pick up the new session cookie.
    router.replace("/dashboard")
    router.refresh()
  }

  return (
    <SignUpForm onSubmit={handleSignUp} error={error} pending={pending} />
  )
}
