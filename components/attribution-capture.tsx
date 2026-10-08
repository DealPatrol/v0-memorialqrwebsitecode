"use client"

import { useEffect } from "react"
import { attributionFromUnknown, firstTouch, parseAttribution, type ClickAttribution } from "@/lib/attribution"

const STORAGE_KEY = "mqr_attribution"

export function readStoredAttribution(): ClickAttribution | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return attributionFromUnknown(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export function captureAttributionFromLocation() {
  try {
    const incoming = parseAttribution(window.location.search)
    const stored = readStoredAttribution()
    const next = firstTouch(stored, incoming)
    if (next && !stored) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Private browsing can block storage. Checkout still proceeds.
  }
}

export function AttributionCapture() {
  useEffect(() => {
    captureAttributionFromLocation()
  }, [])
  return null
}
