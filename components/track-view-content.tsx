"use client"

import { useEffect } from "react"
import { trackCommerce } from "@/components/track-commerce"

export function TrackViewContent({
  contentId,
  contentName,
  value,
}: {
  contentId: string
  contentName: string
  value: number
}) {
  useEffect(() => {
    trackCommerce({ name: "ViewContent", contentId, contentName, value, currency: "USD" })
  }, [contentId, contentName, value])
  return null
}
