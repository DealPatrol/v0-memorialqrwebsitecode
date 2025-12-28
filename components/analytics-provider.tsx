"use client"

import type React from "react"
import { useAnalytics } from "@/lib/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics()
  return <>{children}</>
}
