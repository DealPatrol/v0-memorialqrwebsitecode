"use client"

import { useState, useEffect } from "react"
import { Clock, TrendingUp, Package } from 'lucide-react'

export function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-semibold">
            Limited Time: {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>127 memorials created this week</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>Only 8 luxury boxes left in stock</span>
        </div>
      </div>
    </div>
  )
}
