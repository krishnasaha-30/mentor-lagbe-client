import { Check } from "lucide-react"

/**
 * Banner artwork drawn with SVG so it stays sharp at any size
 * and no external image files are needed.
 */
export function BannerIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <svg
        viewBox="0 0 500 360"
        role="img"
        aria-label="Illustration of an online tutor's laptop with accepted application badges"
        className="h-auto w-full"
      >
        {/* Main mint blob */}
        <circle cx="292" cy="182" r="168" fill="var(--mint)" />

        {/* Decorative shapes */}
        <circle cx="452" cy="66" r="36" fill="var(--coral)" />
        <circle cx="458" cy="292" r="28" fill="var(--coral)" />
        <circle cx="160" cy="84" r="32" fill="var(--sun)" />
        <circle cx="104" cy="312" r="20" fill="var(--sun)" />
        <circle cx="56" cy="228" r="10" fill="var(--coral)" />

        {/* Tutor silhouette behind the laptop */}
        <circle cx="180" cy="178" r="30" fill="var(--sun)" />
        <path d="M128 266c0-38 23-66 52-66s52 28 52 66z" fill="var(--lilac)" />

        {/* Laptop screen */}
        <rect
          x="200"
          y="96"
          width="262"
          height="172"
          rx="16"
          fill="var(--cream)"
          stroke="var(--forest)"
          strokeWidth="9"
        />

        {/* Screen content */}
        <rect
          x="232"
          y="126"
          width="86"
          height="10"
          rx="5"
          fill="var(--forest)"
        />
        <rect x="232" y="150" width="158" height="8" rx="4" fill="#ded7c7" />
        <rect x="232" y="168" width="126" height="8" rx="4" fill="#ded7c7" />
        <rect
          x="232"
          y="196"
          width="62"
          height="20"
          rx="10"
          fill="var(--coral)"
        />
        <rect x="304" y="202" width="76" height="7" rx="3.5" fill="#e6b7a4" />

        {/* Laptop base */}
        <rect
          x="170"
          y="264"
          width="322"
          height="16"
          rx="8"
          fill="var(--forest)"
        />
        <rect
          x="300"
          y="268"
          width="62"
          height="4"
          rx="2"
          fill="#08261f"
          opacity="0.4"
        />

        {/* Sparkle */}
        <path
          d="M448 128c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z"
          fill="var(--coral)"
        />
      </svg>

      {/* Floating badges sit above the SVG */}
      <div className="absolute top-6 left-0 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-medium text-ink shadow-[0_14px_30px_-20px_rgba(20,35,29,0.55)] sm:top-8 sm:text-xs">
        Application accepted
        <Check className="size-3.5 text-forest" strokeWidth={3} />
      </div>

      <div className="absolute right-0 bottom-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-ink shadow-[0_14px_30px_-20px_rgba(20,35,29,0.55)] sm:bottom-6 sm:text-xs">
        <span className="grid size-4 place-items-center rounded-full bg-forest text-white">
          <Check className="size-2.5" strokeWidth={3} />
        </span>
        Approved listing
      </div>
    </div>
  )
}
