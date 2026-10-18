"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { MemorialPhotoFallback } from "@/components/memorial-photo-fallback"

type Props = {
  src?: string | null
  name?: string | null
  /** Pixel size the image is rendered at (used for next/image sizing). */
  size?: number
  className?: string
  priority?: boolean
  variant?: "avatar" | "cover"
}

/** Profile photo that falls back to the floral monogram when missing or broken. */
export function MemorialAvatar({ src, name, size = 176, className, priority, variant = "avatar" }: Props) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  const usable = !!src && !src.startsWith("blob:") && !src.includes("placeholder") && !failed
  if (!usable) return <MemorialPhotoFallback name={name} variant={variant} className={className} />

  return (
    <Image
      src={src}
      alt={name ? `Photo of ${name}` : "Memorial photo"}
      width={variant === "avatar" ? size : Math.round(size * (4 / 3))}
      height={size}
      sizes={variant === "avatar" ? `${size}px` : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
      className={cn("object-cover", variant === "avatar" ? "rounded-full" : "object-[center_25%]", className)}
      priority={priority}
      onError={() => setFailed(true)}
    />
  )
}
