import { connection } from "next/server"

import { Banner } from "@/components/sections/banner"
import { HomeSections } from "@/components/sections/home-sections"
import { getPublicStats, type PublicStats } from "@/lib/api/public-stats"
import { getPublicTuitions } from "@/lib/api/tuitions"
import type { PublicTuition } from "@/lib/types/tuition"

export default async function Page() {
  await connection()

  let tuitions: PublicTuition[] = []
  let tuitionsError = false
  let stats: PublicStats | null = null
  let statsError = false

  const [tuitionResult, statsResult] = await Promise.allSettled([
    getPublicTuitions("limit=6"),
    getPublicStats(),
  ])

  if (tuitionResult.status === "fulfilled") {
    tuitions = tuitionResult.value.tuitions
  } else {
    console.error("Could not load homepage tuitions:", tuitionResult.reason)
    tuitionsError = true
  }

  if (statsResult.status === "fulfilled") {
    stats = statsResult.value
  } else {
    console.error("Could not load homepage statistics:", statsResult.reason)
    statsError = true
  }

  return (
    <main>
      <Banner tutorCount={stats?.tutors} />
      <HomeSections
        tuitions={tuitions}
        tuitionsError={tuitionsError}
        stats={stats}
        statsError={statsError}
      />
    </main>
  )
}
