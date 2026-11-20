import { Clock, Sparkles, Video } from "lucide-react"
import Image from "next/image"

/**
 * Hero visual: a large photo with a smaller overlapping one and two floating
 * "fact" chips. All motion classes live in globals.css.
 */
export function HeroCollage() {
  return (
    <div className="hero-image-enter relative mx-auto w-full max-w-[560px]">
      {/* Decorative ring */}
      <div
        aria-hidden="true"
        className="spin-slow absolute -top-7 right-0 size-24 rounded-full border border-dashed border-forest/25 sm:size-28"
      />

      {/* Main photo */}
      <div className="relative ml-auto w-[88%] overflow-hidden rounded-[30px] border-[6px] border-white bg-cream shadow-[0_40px_90px_-50px_rgba(20,35,29,0.7)] sm:rounded-[34px] sm:border-8">
        <div className="relative aspect-[4/5]">
          <Image
            src="/photos/hero-tutoring.jpg"
            alt="A group of students laughing together while studying with laptops"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-forest-deep/5 to-transparent" />

          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-forest shadow-sm backdrop-blur">
            <Sparkles aria-hidden="true" className="size-3.5 text-coral" />
            Real students, real progress
          </span>

          <p className="absolute inset-x-0 bottom-0 p-5 font-display text-xl leading-snug font-semibold text-white italic sm:p-6 sm:text-2xl">
            Learn better.
            <br />
            Teach smarter.
          </p>
        </div>
      </div>

      {/* Small overlapping photo */}
      <div className="absolute -bottom-6 -left-1 w-[44%] overflow-hidden rounded-[22px] border-4 border-white bg-cream shadow-[0_24px_50px_-30px_rgba(20,35,29,0.6)] sm:-left-6">
        <div className="relative aspect-square">
          <Image
            src="/photos/one-on-one.jpg"
            alt="A student studying online with a laptop"
            fill
            sizes="(max-width: 1024px) 40vw, 18vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Floating facts */}
      <div className="hero-float absolute -top-4 right-0 flex items-center gap-2.5 rounded-2xl border border-line/60 bg-white px-3.5 py-3 text-xs font-semibold text-ink shadow-[0_18px_40px_-24px_rgba(20,35,29,0.5)]">
        <span className="grid size-8 place-items-center rounded-xl bg-mint text-forest">
          <Clock aria-hidden="true" className="size-4" />
        </span>
        2-minute applications
      </div>

      <div className="hero-float hero-float-delayed absolute right-0 bottom-20 flex items-center gap-2.5 rounded-2xl border border-line/60 bg-white px-3.5 py-3 text-xs font-semibold text-ink shadow-[0_18px_40px_-24px_rgba(20,35,29,0.5)]">
        <span className="grid size-8 place-items-center rounded-xl bg-peach text-coral-dark">
          <Video aria-hidden="true" className="size-4" />
        </span>
        Online &amp; in-person
      </div>
    </div>
  )
}
