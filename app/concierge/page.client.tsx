'use client'

import { ConciergeForm } from "@/components/concierge-form"
import Link from "next/link"

export function ConciergePageClient() {
  const handleCheckout = (type: string) => {
    localStorage.setItem(
      "checkoutItems",
      JSON.stringify([
        {
          id: type,
          name: type === "concierge-plaque" ? "Concierge Service - Physical Plaque" : "Concierge Service - Digital Link",
          price: type === "concierge-plaque" ? 329.99 : 299.99,
          quantity: 1,
        },
      ])
    )
    window.location.href = "/checkout/simple"
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            We Build the Legacy For You
          </h1>
          <p className="text-xl text-zinc-400 mb-6">
            Too busy grieving? Let our team handle the details. Send us your memories, photos, and stories. We'll create a beautiful, interactive digital memorial with a professional QR code plaque.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="bg-zinc-900 rounded-lg p-6 flex-1 max-w-xs">
              <div className="text-3xl font-bold text-amber-500 mb-2">$299</div>
              <p className="text-zinc-300">Digital Link Only</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-6 flex-1 max-w-xs">
              <div className="text-3xl font-bold text-amber-500 mb-2">$329</div>
              <p className="text-zinc-300">+ Physical Plaque</p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-zinc-900 rounded-lg p-8 mb-12 border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">What We Do For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-2xl">📸</div>
              <div>
                <h3 className="font-semibold text-white mb-2">Photo Organization</h3>
                <p className="text-zinc-400">We organize all your photos into beautiful galleries</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🎬</div>
              <div>
                <h3 className="font-semibold text-white mb-2">Video Integration</h3>
                <p className="text-zinc-400">Upload videos and we'll add them to the memorial</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">✍️</div>
              <div>
                <h3 className="font-semibold text-white mb-2">Biography Writing</h3>
                <p className="text-zinc-400">We craft a polished, meaningful life story</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">🎨</div>
              <div>
                <h3 className="font-semibold text-white mb-2">Design & Layout</h3>
                <p className="text-zinc-400">Professional design that honors their memory</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold text-white mb-2">QR Code Plaque</h3>
                <p className="text-zinc-400">Choose digital link or physical plaque with QR code</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">♾️</div>
              <div>
                <h3 className="font-semibold text-white mb-2">Lifetime Access</h3>
                <p className="text-zinc-400">Your memorial lives forever, always accessible</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-amber-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Submit Your Information</h3>
                <p className="text-zinc-400">Fill out the form below with photos, videos, obituary, and basic details</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">We Create Your Memorial</h3>
                <p className="text-zinc-400">Our team designs, writes, and organizes everything into a beautiful memorial</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Review & Approve</h3>
                <p className="text-zinc-400">We'll send you the memorial for review and make any adjustments</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Get Your QR Code</h3>
                <p className="text-zinc-400">Receive your digital link or order physical plaques with the QR code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intake Form */}
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
          <ConciergeForm />
        </div>

        {/* Checkout Option */}
        <div className="mt-12 bg-amber-500/10 border border-amber-500/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Order Now?</h3>
          <p className="text-zinc-300 mb-6">You can also checkout directly and our team will contact you for your memorial details.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleCheckout("concierge-digital")}
              className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Checkout - Digital Link ($299)
            </button>
            <button
              onClick={() => handleCheckout("concierge-plaque")}
              className="bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Checkout - With Plaque ($329)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
