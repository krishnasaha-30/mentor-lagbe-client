"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "mentorlagbe_saved_tuitions"

export function getSavedTuitionIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []
  } catch {
    return []
  }
}

export function isTuitionSaved(id: string): boolean {
  return getSavedTuitionIds().includes(id)
}

export function toggleSaveTuition(id: string): boolean {
  if (typeof window === "undefined") return false
  const current = getSavedTuitionIds()
  let next: string[]
  let saved: boolean

  if (current.includes(id)) {
    next = current.filter((item) => item !== id)
    saved = false
  } else {
    next = [...current, id]
    saved = true
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("mentorlagbe_bookmarks_updated"))
  } catch {
    // LocalStorage quota or blocked
  }

  return saved
}

export function useIsTuitionSaved(id: string) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isTuitionSaved(id))

    function onUpdated() {
      setSaved(isTuitionSaved(id))
    }

    window.addEventListener("mentorlagbe_bookmarks_updated", onUpdated)
    window.addEventListener("storage", onUpdated)

    return () => {
      window.removeEventListener("mentorlagbe_bookmarks_updated", onUpdated)
      window.removeEventListener("storage", onUpdated)
    }
  }, [id])

  return saved
}

export function useSavedTuitionIds() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(getSavedTuitionIds())

    function onUpdated() {
      setIds(getSavedTuitionIds())
    }

    window.addEventListener("mentorlagbe_bookmarks_updated", onUpdated)
    window.addEventListener("storage", onUpdated)

    return () => {
      window.removeEventListener("mentorlagbe_bookmarks_updated", onUpdated)
      window.removeEventListener("storage", onUpdated)
    }
  }, [])

  return ids
}
