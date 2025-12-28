"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRImageProps {
  value?: string
  size?: number
  className?: string
}

export function QRImage({ value, size = 300, className = "" }: QRImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      // Get the current URL to use as a fallback
      const currentUrl = typeof window !== "undefined" ? window.location.origin : ""

      // Use the provided value, or fallback to current URL + /example
      const qrValue = value || `${currentUrl}/example`

      QRCode.toCanvas(
        canvasRef.current,
        qrValue,
        {
          width: size,
          margin: 4,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error)
        },
      )
    }
  }, [value, size])

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="rounded-md" />
    </div>
  )
}
