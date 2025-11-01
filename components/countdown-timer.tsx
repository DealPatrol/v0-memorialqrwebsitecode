"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set target date to 30 days from now
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)

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
    <Card className="countdown-bg border-white/20">
      <CardContent className="p-4">
        <div className="text-center text-white">
          <div className="text-sm font-medium mb-2">Limited Time Offer</div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <div className="text-lg font-bold">{timeLeft.days}</div>
              <div>Days</div>
            </div>
            <div>
              <div className="text-lg font-bold">{timeLeft.hours}</div>
              <div>Hours</div>
            </div>
            <div>
              <div className="text-lg font-bold">{timeLeft.minutes}</div>
              <div>Min</div>
            </div>
            <div>
              <div className="text-lg font-bold">{timeLeft.seconds}</div>
              <div>Sec</div>
            </div>
          </div>
          <div className="text-xs mt-2 opacity-90">Save 30% Today!</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CountdownTimer
