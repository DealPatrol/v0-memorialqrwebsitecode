"use client"

import { useState, useEffect } from "react"

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = (window.scrollY / scrollHeight) * 100
      setProgress(Math.min(scrollProgress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-800 z-[100]">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
