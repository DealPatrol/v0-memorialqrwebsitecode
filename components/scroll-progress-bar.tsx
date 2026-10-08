"use client"

import { useEffect, useRef } from "react"

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const bar = barRef.current
        if (!bar) return
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollHeight > 0 ? Math.min((window.scrollY / scrollHeight) * 100, 100) : 0
        bar.style.width = `${progress}%`
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-zinc-800">
      <div ref={barRef} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: "0%" }} />
    </div>
  )
}
