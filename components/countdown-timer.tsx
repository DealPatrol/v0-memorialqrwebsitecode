"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date()
    targetDate.setHours(targetDate.getHours() + 10)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-white/95 backdrop-blur-md border-2 border-purple-200 shadow-2xl">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <div className="text-sm font-bold text-purple-600 uppercase tracking-wide">Limited Time Offer</div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-white/90 font-medium">Days</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-white/90 font-medium">Hours</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-white/90 font-medium">Min</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
              <div className="text-xs text-white/90 font-medium">Sec</div>
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900 bg-yellow-100 rounded-full px-4 py-2 inline-block">
            🎉 Save 30% Today!
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CountdownTimer
