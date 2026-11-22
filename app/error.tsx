"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle, House, RotateCw } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Route-level error boundary. It replaces the page but keeps the app shell
 * usable and gives the visitor two clear ways forward.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-5 py-16">
      <section className="w-full max-w-lg rounded-[24px] border border-line bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-stat-peach text-coral-dark">
          <AlertTriangle aria-hidden="true" className="size-6" />
        </span>
        <p className="mt-5 text-xs font-bold tracking-[0.16em] text-ink-soft uppercase">
          Something went wrong
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          We could not load this page
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          A temporary problem interrupted the request. Try again, or head back
          to the home page and continue from there.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className={cn(
              buttonVariants(),
              "h-10 gap-2 rounded-full bg-coral px-5 text-white hover:bg-coral-dark"
            )}
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-2 rounded-full border-line px-5 text-ink hover:bg-cream-soft"
            )}
          >
            <House aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}
