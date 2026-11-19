import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function UnauthorizedPage() {
  return (
    <main className="page-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <p className="font-display text-6xl font-bold italic text-coral">401</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          You don&apos;t have access
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          This page is only available to signed-in users with the right role.
          Please sign in with the correct account and try again.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants(),
              "h-10 rounded-lg bg-coral px-5 text-white hover:bg-coral-dark"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 rounded-lg border-ink/20 bg-white px-5 text-ink hover:bg-cream-soft"
            )}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
