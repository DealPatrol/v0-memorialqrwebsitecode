"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  hours: number
}

export function CountdownTimer({ hours }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: hours,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center gap-2 text-xl font-bold">
      <div className="bg-gray-800 text-white px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, "0")}</div>
      <span>:</span>
      <div className="bg-gray-800 text-white px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, "0")}</div>
      <span>:</span>
      <div className="bg-gray-800 text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, "0")}</div>
    </div>
  )
}
