import { MapPin } from "lucide-react"
import Link from "next/link"

import { StatusBadge } from "@/components/dashboard/status-badge"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { PublicTuition } from "@/lib/types/tuition"

const bannerThemes = [
  "bg-mint",
  "bg-peach",
  "bg-lilac",
  "bg-stat-butter",
  "bg-[#dff2d6]",
] as const

function getBannerTheme(subject: string) {
  const subjectHash = Array.from(subject).reduce(
    (hash, character) => hash + character.charCodeAt(0),
    0
  )

  return bannerThemes[subjectHash % bannerThemes.length]
}

function formatMonthlyFee(amount: number) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

export function TuitionCard({ tuition }: { tuition: PublicTuition }) {
  return (
    <Link
      href={`/tuitions/${encodeURIComponent(tuition.id)}`}
      className="block overflow-hidden rounded-[20px] border border-line bg-white p-3.5 transition-shadow hover:shadow-[0_12px_30px_-20px_rgba(20,35,29,0.55)] focus-visible:ring-3 focus-visible:ring-forest/30 focus-visible:outline-none"
    >
      <div
        className={`relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-xl ${getBannerTheme(tuition.subject)}`}
      >
        {tuition.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tuition.bannerImage}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span className="font-display text-4xl font-bold text-ink">
            {tuition.subject}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-3">
        <StatusBadge
          status="approved"
          label={tuition.subject}
          className="px-2.5 py-0.5 text-[10px]"
        />
        <StatusBadge
          status="active"
          label={tuition.mode}
          className="px-2.5 py-0.5 text-[10px]"
        />
      </div>

      <h2 className="mt-2 line-clamp-2 min-h-12 font-display text-lg leading-6 font-bold text-ink">
        {tuition.title}
      </h2>

      <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-ink-soft">
        {tuition.tutor ? (
          <>
            <UserAvatar
              name={tuition.tutor.name}
              image={tuition.tutor.image}
              size="sm"
            />
            <span className="truncate">{tuition.tutor.name}</span>
            {tuition.tutor.plan === "pro" ? (
              <span className="shrink-0 text-forest">Pro tutor</span>
            ) : null}
          </>
        ) : (
          <span>Tutor details unavailable</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="min-w-0 text-xs text-ink-soft">
          <p>{tuition.classLevel}</p>
          <p className="mt-1 flex items-center gap-1 truncate">
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            {tuition.location}
          </p>
          <p className="mt-1">{tuition.daysPerWeek} days / week</p>
        </div>
        <p className="shrink-0 text-sm font-bold text-ink">
          {formatMonthlyFee(tuition.monthlyFee)}
          <span className="font-normal text-ink-soft">/mo</span>
        </p>
      </div>
    </Link>
  )
}
