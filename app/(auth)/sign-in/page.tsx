"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
  SignInForm,
  type SignInFormData,
} from "@/components/auth/signin-form"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  async function handleSignIn(data: SignInFormData) {
    setError(null)
    setPending(true)

    const { error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    })

    setPending(false)

    if (signInError) {
      // e.g. "Invalid email or password."
      const message =
        signInError.message ?? "Something went wrong. Please try again."
      setError(message)
      toast.error(message)
      return
    }

    toast.success("Welcome back!")
    // Refresh so server components pick up the new session cookie.
    router.replace("/dashboard")
    router.refresh()
  }

  async function handleGoogle() {
    setError(null)
    setGooglePending(true)

    const { error: googleError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })

    // On success the browser is already redirecting to Google, so we only
    // reach here when something failed.
    if (googleError) {
      setGooglePending(false)
      const message = googleError.message ?? "Could not connect to Google."
      setError(message)
      toast.error(message)
    }
  }

  return (
    <SignInForm
      onSubmit={handleSignIn}
      onGoogle={handleGoogle}
      error={error}
      pending={pending}
      googlePending={googlePending}
    />
  )
}
