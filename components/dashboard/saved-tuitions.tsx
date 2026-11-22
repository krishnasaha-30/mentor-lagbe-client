"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, RotateCw } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { TuitionCard } from "@/components/sections/tuition-card"
import { getPublicTuition } from "@/lib/api/tuitions"
import { useSavedTuitionIds } from "@/lib/bookmarks"
import type { PublicTuitionDetails } from "@/lib/types/tuition"

export function SavedTuitions() {
  const savedIds = useSavedTuitionIds()
  const [tuitions, setTuitions] = useState<PublicTuitionDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSaved() {
      if (savedIds.length === 0) {
        setTuitions([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const results = await Promise.all(
          savedIds.map(async (id) => {
            try {
              return await getPublicTuition(id)
            } catch {
              return null
            }
          })
        )

        if (cancelled) return

        const validTuitions = results.filter(
          (item): item is PublicTuitionDetails => item !== null
        )

        setTuitions(validTuitions)
      } catch {
        if (!cancelled) {
          setError("Could not load some of your saved tuitions.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSaved()

    return () => {
      cancelled = true
    }
  }, [savedIds])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-[20px] border border-line bg-white/60 p-4"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1200px] py-8">
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <p className="text-sm text-ink">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest hover:bg-cream-soft"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (tuitions.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] py-8">
        <EmptyState
          icon={Bookmark}
          title="No saved tuitions"
          description="Bookmark your favorite tuitions while browsing so you can easily review and apply to them later."
          action={
            <Link
              href="/tuitions"
              className="inline-flex h-10 items-center rounded-full bg-coral px-5 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              Browse Tuitions
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-12">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          You have <span className="font-semibold text-ink">{tuitions.length}</span> saved tuition{tuitions.length === 1 ? "" : "s"}.
        </p>
        <Link
          href="/tuitions"
          className="text-xs font-semibold text-forest underline underline-offset-4"
        >
          Find more tuitions
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tuitions.map((tuition) => (
          <TuitionCard key={tuition.id} tuition={tuition} />
        ))}
      </div>
    </div>
  )
}
