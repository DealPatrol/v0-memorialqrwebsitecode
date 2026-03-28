"use client"

import React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const guides = [
  {
    title: "How to Grieve Healthily",
    description: "Evidence-based strategies for processing grief and supporting your emotional wellbeing",
  },
  {
    title: "Creating Meaningful Memorials",
    description: "Tips for designing tributes that truly honor your loved one's memory",
  },
  {
    title: "Sharing Memories with Family",
    description: "How to involve loved ones in creating lasting digital tributes",
  },
]

export function EmailCollectionPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(guides[0])

  useEffect(() => {
    const hasShown = sessionStorage.getItem("emailPopupShown")
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        sessionStorage.setItem("emailPopupShown", "true")
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          guide: selectedGuide.title,
        }),
      })
      setSubmitted(true)
      setTimeout(() => setIsVisible(false), 2000)
    } catch (error) {
      console.error("Error subscribing:", error)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-zinc-800 rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Get a Free Guide</h3>
              <p className="text-sm text-zinc-400 mt-1">Join families honoring their loved ones</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!submitted ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  Choose your guide:
                </label>
                <div className="space-y-2">
                  {guides.map((guide) => (
                    <button
                      key={guide.title}
                      onClick={() => setSelectedGuide(guide)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedGuide.title === guide.title
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                      }`}
                    >
                      <p className="font-medium text-white text-sm">{guide.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{guide.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Get Free Guide
                </Button>
              </form>

              <p className="text-xs text-zinc-500 text-center mt-4">
                We respect your privacy. No spam, ever.
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-white font-semibold mb-1">Thank you!</p>
              <p className="text-sm text-zinc-400">Check your email for your free guide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
