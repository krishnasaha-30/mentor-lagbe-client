"use client"

import { useMemo, useSyncExternalStore } from "react"

const STORAGE_KEY = "mentorlagbe_saved_tuitions"
const UPDATE_EVENT = "mentorlagbe_bookmarks_updated"
const EMPTY_SNAPSHOT = "[]"

function parseIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : []
  } catch {
    return []
  }
}

/** Refreshes every bookmark hook when this tab (or another one) changes storage. */
function subscribe(onChange: () => void) {
  window.addEventListener(UPDATE_EVENT, onChange)
  window.addEventListener("storage", onChange)

  return () => {
    window.removeEventListener(UPDATE_EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT
}

export function getSavedTuitionIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    return parseIds(localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT)
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
    window.dispatchEvent(new Event(UPDATE_EVENT))
  } catch {
    // LocalStorage quota or blocked
  }

  return saved
}

export function useSavedTuitionIds(): string[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return useMemo(() => parseIds(raw), [raw])
}

export function useIsTuitionSaved(id: string) {
  const ids = useSavedTuitionIds()

  return ids.includes(id)
}
