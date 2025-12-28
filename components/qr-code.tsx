"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  level?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
}

export function QRCodeGenerator({
  value,
  size = 200,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  level = "M",
  includeMargin = true,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      // Get the current URL to use as a fallback
      const currentUrl = typeof window !== "undefined" ? window.location.origin : ""

      // Use the provided value, or fallback to current URL
      const qrValue = value || currentUrl

      QRCode.toCanvas(
        canvasRef.current,
        qrValue,
        {
          width: size,
          margin: includeMargin ? 4 : 0,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: level,
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error)
        },
      )
    }
  }, [value, size, bgColor, fgColor, level, includeMargin])

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  )
}
