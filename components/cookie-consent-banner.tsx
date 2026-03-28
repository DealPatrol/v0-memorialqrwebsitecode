'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already given consent
    const storedConsent = localStorage.getItem('cookieConsent')
    if (storedConsent) {
      setHasConsent(JSON.parse(storedConsent))
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const consentData = {
      analytics: true,
      marketing: true,
      necessary: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consentData))
    setHasConsent(true)
    setShowBanner(false)
    
    // Load analytics
    loadAnalytics()
  }

  const handleRejectAll = () => {
    const consentData = {
      analytics: false,
      marketing: false,
      necessary: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consentData))
    setHasConsent(true)
    setShowBanner(false)
  }

  const handleCustomize = () => {
    // Open settings - could be a modal or separate page
    const consentData = {
      analytics: true,
      marketing: false,
      necessary: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consentData))
    setHasConsent(true)
    setShowBanner(false)
  }

  const loadAnalytics = () => {
    // Load Google Analytics or other tracking scripts
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        marketing_storage: 'granted',
      })
    }
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Cookies & Privacy:</strong> We use cookies to enhance your experience, analyze site traffic, and improve our services. By clicking "Accept All," you consent to our use of cookies. View our{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline font-medium">
                Privacy Policy
              </a>{' '}
              for more details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectAll}
              className="whitespace-nowrap text-xs sm:text-sm bg-transparent"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomize}
              className="whitespace-nowrap text-xs sm:text-sm bg-transparent"
            >
              Customize
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap text-xs sm:text-sm"
            >
              Accept All
            </Button>
          </div>

          <button
            onClick={handleRejectAll}
            className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
