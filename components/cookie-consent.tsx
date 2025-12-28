"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { initGA } from "@/lib/analytics"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all")
    setShowBanner(false)
    initGA() // Initialize Google Analytics after consent
  }

  const acceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <p>
            We use cookies to enhance your experience on our website. By continuing to browse, you agree to our{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={acceptEssential}>
            Essential Only
          </Button>
          <Button onClick={acceptAll}>Accept All</Button>
        </div>
      </div>
    </div>
  )
}
