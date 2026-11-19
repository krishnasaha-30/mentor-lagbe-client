const avatars = [
  { bg: "#fbe2d5", skin: "#eab08a", shirt: "#0e3b31", hair: "#3a2a22" },
  { bg: "#cfe9dd", skin: "#9a6446", shirt: "#ff6b3d", hair: "#1c1512" },
  { bg: "#f7ce68", skin: "#f3c8a4", shirt: "#b9a9f2", hair: "#6b4a2f" },
  { bg: "#b9a9f2", skin: "#6b4432", shirt: "#14231d", hair: "#100d0b" },
  { bg: "#a9c7e6", skin: "#f6d3b4", shirt: "#ffb26b", hair: "#c98a4b" },
]

/**
 * The overlapping avatar row used on the dark auth panel.
 * Drawn with SVG so it needs no image assets.
 */
export function AvatarRow() {
  return (
    <svg
      viewBox="0 0 240 72"
      role="img"
      aria-label="Illustration of five tutors"
      className="h-[72px] w-auto"
    >
      {avatars.map((avatar, index) => {
        const clipId = `auth-avatar-${index}`

        return (
          <g key={clipId} transform={`translate(${26 + index * 42} 36)`}>
            <circle r="26" fill={avatar.bg} />
            <clipPath id={clipId}>
              <circle r="26" />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>
              {/* Shoulders */}
              <path
                d="M-19 34c0-11 8.5-18 19-18s19 7 19 18z"
                fill={avatar.shirt}
              />
              {/* Head */}
              <circle cy="-5" r="9.5" fill={avatar.skin} />
              {/* Hair */}
              <path
                d="M-9.5 -6c0-6 4-10 9.5-10s9.5 4 9.5 10c0 3-1 5.5-2.5 7 .5-4.5-1.5-7-7-7s-7.5 2.5-7 7c-1.5-1.5-2.5-4-2.5-7z"
                fill={avatar.hair}
              />
            </g>
            <circle
              r="26"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="2"
            />
          </g>
        )
      })}
    </svg>
  )
}
