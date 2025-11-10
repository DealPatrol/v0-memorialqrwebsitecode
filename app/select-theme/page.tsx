"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function SelectThemePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTheme, setSelectedTheme] = useState("classic")
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Get order ID from URL params (passed from Square payment success)
    const orderIdParam = searchParams.get("orderId")
    if (orderIdParam) {
      setOrderId(orderIdParam)
      // Store in session storage for memorial creation
      sessionStorage.setItem("orderId", orderIdParam)
      sessionStorage.setItem("selectedTheme", selectedTheme)
    }
  }, [searchParams, selectedTheme])

  const handleContinue = () => {
    // Store theme selection
    sessionStorage.setItem("selectedTheme", selectedTheme)

    // Navigate to memorial creation with theme
    if (orderId) {
      router.push(`/create-memorial?orderId=${orderId}&theme=${selectedTheme}`)
    } else {
      router.push(`/create-memorial?theme=${selectedTheme}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Payment Successful
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Create Your Memorial</h1>
          <p className="text-center text-gray-600 text-lg">Let's personalize your loved one's memorial page</p>
        </div>

        {/* Theme Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <ThemeSelector selectedTheme={selectedTheme} onThemeSelect={setSelectedTheme} />
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Continue to Memorial Details
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
