"use client"

import { useEffect } from "react"
import { DIGITAL_LANDING_STORAGE_KEY, resolveDigitalLanding } from "@/lib/digital-landing-attribution"

export function readDigitalLanding(): string | null {
  if (typeof window === "undefined") return null
  try {
    return resolveDigitalLanding(window.sessionStorage.getItem(DIGITAL_LANDING_STORAGE_KEY), "")
  } catch {
    return null
  }
}

/** Remember the first digital selling page in this tab and return that path. */
export function rememberDigitalLanding(pathname: string): string | null {
  if (typeof window === "undefined") return resolveDigitalLanding(null, pathname)
  try {
    const stored = window.sessionStorage.getItem(DIGITAL_LANDING_STORAGE_KEY)
    const next = resolveDigitalLanding(stored, pathname)
    if (next && next !== stored) window.sessionStorage.setItem(DIGITAL_LANDING_STORAGE_KEY, next)
    return next
  } catch {
    return resolveDigitalLanding(null, pathname)
  }
}

export function RememberDigitalLanding({ pathname }: { pathname: string }) {
  useEffect(() => {
    rememberDigitalLanding(pathname)
  }, [pathname])
  return null
}
