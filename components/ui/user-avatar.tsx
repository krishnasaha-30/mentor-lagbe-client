import { cn } from "@/lib/utils"

/**
 * The screenshots use illustrated faces, so this draws the same style with
 * SVG (no image assets needed). Users with an uploaded photo get their photo.
 */

const palettes = [
  { bg: "#cfe9dd", skin: "#9a6446", shirt: "#ff6b3d", hair: "#1c1512" },
  { bg: "#fbe2d5", skin: "#eab08a", shirt: "#0e3b31", hair: "#3a2a22" },
  { bg: "#fbe8b1", skin: "#f3c8a4", shirt: "#b9a9f2", hair: "#6b4a2f" },
  { bg: "#e4ddfb", skin: "#6b4432", shirt: "#14231d", hair: "#100d0b" },
  { bg: "#a9c7e6", skin: "#f6d3b4", shirt: "#ffb26b", hair: "#c98a4b" },
]

const sizes = {
  sm: 28,
  md: 32,
  lg: 40,
  xl: 56,
} as const

type AvatarSize = keyof typeof sizes

/** Same name -> same face, so a user looks the same on every page. */
function paletteFor(name: string) {
  let hash = 0
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997
  }
  return palettes[hash % palettes.length]
}

export function UserAvatar({
  name,
  image,
  size = "md",
  className,
}: {
  name: string
  image?: string | null
  size?: AvatarSize
  className?: string
}) {
  const px = sizes[size]
  const palette = paletteFor(name)

  return (
    <span
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-full bg-cream-soft",
        className
      )}
      style={{ width: px, height: px }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg
          viewBox="0 0 64 64"
          className="size-full"
          role="img"
          aria-label={`${name} avatar`}
        >
          <rect width="64" height="64" fill={palette.bg} />
          {/* Shoulders */}
          <path d="M4 64c0-15 12.5-24 28-24s28 9 28 24z" fill={palette.shirt} />
          {/* Neck */}
          <rect x="27" y="33" width="10" height="12" rx="5" fill={palette.skin} />
          {/* Head */}
          <circle cx="32" cy="27" r="12" fill={palette.skin} />
          {/* Hair */}
          <path
            d="M19 25c0-7.5 5.5-12.5 13-12.5S45 17.5 45 25c0 3.5-1 6-2.5 7.5.5-5.5-2-9-10.5-9s-11 3.5-10.5 9C20 31 19 28.5 19 25z"
            fill={palette.hair}
          />
        </svg>
      )}
    </span>
  )
}
