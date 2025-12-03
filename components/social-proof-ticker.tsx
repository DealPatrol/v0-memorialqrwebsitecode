"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, X } from 'lucide-react'

const recentPurchases = [
  { name: "Sarah M.", location: "California", package: "Standard", time: "2 minutes ago" },
  { name: "James R.", location: "Texas", package: "Premium", time: "5 minutes ago" },
  { name: "Maria G.", location: "Florida", package: "Basic", time: "8 minutes ago" },
  { name: "David L.", location: "New York", package: "Standard", time: "12 minutes ago" },
  { name: "Jennifer K.", location: "Ohio", package: "Premium", time: "15 minutes ago" },
]

export function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const hasShownThisSession = sessionStorage.getItem("socialProofShown")
    
    if (hasShownThisSession) {
      return
    }

    const showTimer = setTimeout(() => {
      setIsVisible(true)
      sessionStorage.setItem("socialProofShown", "true")
    }, 3000)

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 11000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentPurchases.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!isVisible || isDismissed) return null

  const purchase = recentPurchases[currentIndex]

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 border-2 border-green-500 max-w-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500">
            <AvatarFallback className="text-white font-bold">{purchase.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="font-semibold text-sm">
                {purchase.name} from {purchase.location}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Purchased {purchase.package} Package • {purchase.time}
            </p>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
