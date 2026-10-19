"use client"

import { useEffect } from "react"
import { rememberDigitalLanding } from "@/components/remember-digital-landing"
import { trackCommerce } from "@/components/track-commerce"

export function TrackViewContent({
  contentId,
  contentName,
  value,
  landingPath,
}: {
  contentId: string
  contentName: string
  value: number
  /** When set, the first digital selling page in this tab is stored and sent with the view. */
  landingPath?: string
}) {
  useEffect(() => {
    const remembered = landingPath ? rememberDigitalLanding(landingPath) : null
    trackCommerce({
      name: "ViewContent",
      contentId,
      contentName,
      value,
      currency: "USD",
      landingPath: remembered ?? undefined,
    })
  }, [contentId, contentName, landingPath, value])
  return null
}
