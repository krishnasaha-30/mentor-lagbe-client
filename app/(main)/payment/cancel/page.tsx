import Link from "next/link"
import { CircleX } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-5 py-16">
      <section className="w-full rounded-[24px] border border-line bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-stat-butter text-ink">
          <CircleX aria-hidden="true" className="size-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold text-ink">
          Checkout canceled
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          Your subscription was not activated. You can return to pricing and try
          again whenever you are ready.
        </p>
        <Link
          href="/#pricing"
          className="mt-7 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-forest"
        >
          Return to pricing
        </Link>
      </section>
    </main>
  )
}
