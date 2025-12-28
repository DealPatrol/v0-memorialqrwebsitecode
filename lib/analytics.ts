"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX" // Replace with your actual Google Analytics ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && !window.gtag) {
    const script1 = document.createElement("script")
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag("js", new Date())
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    })
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({ action, category, label, value }: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// React hook to initialize GA and track page views
export const useAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user has consented to cookies
    const hasConsented = localStorage.getItem("cookieConsent")
    if (hasConsented === "all") {
      initGA()
    }
  }, [])

  useEffect(() => {
    // Check if user has consented to cookies
    const hasConsented = localStorage.getItem("cookieConsent")
    if (hasConsented === "all" && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      pageview(url)
    }
  }, [pathname, searchParams])
}

// Add TypeScript declarations
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
