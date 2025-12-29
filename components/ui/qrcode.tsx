"use client"

import { useEffect, useRef } from "react"
import QRCodeLib from "qrcode"

interface QrCodeProps {
  value: string
  size?: number
  color?: string
  style?: "standard" | "dots" | "rounded"
  className?: string
}

export default function QrCode({
  value,
  size = 300,
  color = "#000000",
  style = "standard",
  className = "",
}: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!value || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Generate QR code
    QRCodeLib.toCanvas(
      canvas,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: "#FFFFFF",
        },
      },
      (error) => {
        if (error) {
          console.error("QR Code generation error:", error)
          return
        }

        // Apply style modifications
        if (style === "dots" || style === "rounded") {
          applyStyle(ctx, canvas, style, color)
        }
      },
    )
  }, [value, size, color, style])

  const applyStyle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, style: string, color: string) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.width)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.width)

    const moduleSize = canvas.width / 33 // Approximate module size for QR code

    // Redraw with style
    for (let y = 0; y < canvas.height; y += moduleSize) {
      for (let x = 0; x < canvas.width; x += moduleSize) {
        const pixelIndex = (Math.floor(y) * canvas.width + Math.floor(x)) * 4
        const isDark = data[pixelIndex] < 128 // Check if pixel is dark

        if (isDark) {
          ctx.fillStyle = color

          if (style === "dots") {
            ctx.beginPath()
            ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 3, 0, 2 * Math.PI)
            ctx.fill()
          } else if (style === "rounded") {
            const radius = moduleSize * 0.2
            ctx.beginPath()
            ctx.roundRect(x + 1, y + 1, moduleSize - 2, moduleSize - 2, radius)
            ctx.fill()
          }
        }
      }
    }

    // Preserve finder patterns (corners) for scanning reliability
    preserveFinderPatterns(ctx, canvas, color, moduleSize)
  }

  const preserveFinderPatterns = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    color: string,
    moduleSize: number,
  ) => {
    const positions = [
      { x: 0, y: 0 }, // Top-left
      { x: canvas.width - 7 * moduleSize, y: 0 }, // Top-right
      { x: 0, y: canvas.height - 7 * moduleSize }, // Bottom-left
    ]

    positions.forEach((pos) => {
      // Draw finder pattern as standard squares
      ctx.fillStyle = color
      ctx.fillRect(pos.x, pos.y, 7 * moduleSize, 7 * moduleSize)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(pos.x + moduleSize, pos.y + moduleSize, 5 * moduleSize, 5 * moduleSize)
      ctx.fillStyle = color
      ctx.fillRect(pos.x + 2 * moduleSize, pos.y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
    })
  }

  return <canvas ref={canvasRef} className={`qr-canvas ${className}`} width={size} height={size} />
}
