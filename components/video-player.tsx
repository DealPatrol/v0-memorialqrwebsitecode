"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  fallbackImage?: string
}

export function VideoPlayer({ src, poster, title, fallbackImage }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Simplified approach - just show native video with controls
  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  // Simple error handler
  const handleError = () => {
    console.log("Video failed to load:", src)
    setHasError(true)
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-900">
      {hasError ? (
        // Error state - show fallback image
        <div className="aspect-video">
          <div className="relative w-full h-full">
            <Image
              src={fallbackImage || poster || "/images/hero-image.png"}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Video Unavailable</h3>
              <p className="text-center max-w-md">Sorry, the video could not be played. Please check back later.</p>
            </div>
          </div>
        </div>
      ) : isPlaying ? (
        // Playing state - show video with native controls
        <video ref={videoRef} className="w-full aspect-video" controls autoPlay playsInline onError={handleError}>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        // Initial state - show poster with play button
        <div className="relative aspect-video">
          <Image src={poster || fallbackImage || "/images/hero-image.png"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Button
              onClick={handlePlayClick}
              className="rounded-full w-16 h-16 flex items-center justify-center bg-white bg-opacity-80 hover:bg-opacity-100"
              aria-label="Play video"
            >
              <Play className="h-8 w-8 text-gray-900" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h3 className="font-medium text-white">{title}</h3>
          </div>
        </div>
      )}
    </div>
  )
}
