import { BannerIllustration } from "@/components/sections/banner-illustration"

export function Banner() {
  return (
    <section className="pt-4 pb-12 sm:pt-6 sm:pb-16">
      <div className="page-container">
        <div className="grid items-center gap-10 rounded-3xl border-2 border-sky-line bg-cream px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-14 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-peach px-3.5 py-1.5 text-[11px] font-medium text-ink">
              <span className="size-1.5 rounded-full bg-coral" />
              Online &amp; offline tuition
            </span>

            <h1 className="mt-6 font-display text-[2.65rem] leading-[1.03] font-bold tracking-[-0.02em] text-forest sm:text-[3.25rem] lg:text-[3.9rem]">
              Find your ideal tutor{" "}
              <span className="italic text-coral">today.</span>
            </h1>

            <p className="mt-5 max-w-[430px] text-sm leading-7 text-ink-soft sm:text-[15px]">
              Search verified tutors by subject, class level and budget, then
              apply in minutes.
            </p>

            <form
              action="/tuitions"
              className="mt-7 flex w-full max-w-[460px] flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_16px_40px_-24px_rgba(20,35,29,0.5)] sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-1.5 sm:pl-4"
            >
              <input
                type="search"
                name="q"
                aria-label="Search tuitions"
                placeholder="Search subject or title..."
                className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink-soft/70 sm:px-0"
              />
              <button
                type="submit"
                className="h-10 w-full shrink-0 rounded-full bg-coral px-5 text-sm font-medium text-white transition-colors hover:bg-coral-dark sm:w-auto"
              >
                Browse Tuitions
              </button>
            </form>
          </div>

          <BannerIllustration />
        </div>
      </div>
    </section>
  )
}
