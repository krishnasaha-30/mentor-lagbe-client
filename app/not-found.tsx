import Link from "next/link"
import { Compass, House, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-5 py-16">
      <section className="w-full max-w-lg rounded-[24px] border border-line bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="font-display text-6xl font-bold italic text-coral">404</p>
        <div className="mx-auto mt-4 grid size-12 place-items-center rounded-2xl bg-stat-mint text-forest">
          <Compass aria-hidden="true" className="size-5" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          This page could not be found
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          The link may be broken, or the page may have moved. Let&apos;s get you
          back to something useful.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "h-10 gap-2 rounded-full bg-ink px-5 text-white hover:bg-forest"
            )}
          >
            <House aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <Link
            href="/tuitions"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-2 rounded-full border-line px-5 text-ink hover:bg-cream-soft"
            )}
          >
            <Search aria-hidden="true" className="size-4" />
            Browse tuitions
          </Link>
        </div>
      </section>
    </main>
  )
}
