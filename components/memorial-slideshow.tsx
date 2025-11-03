"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/24e70872-240d-475d-a804-7b1e0c9b81d3.jpg",
    alt: "Child holding memorial QR keychain",
    description: "Keep their memory close with a beautiful wooden QR keychain",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1b96464e-9ee4-4159-ae59-c52cf9696d8f.jpg",
    alt: "Memorial plaque on vintage books",
    description: "Elegant memorial plaques that honor your loved one with dignity",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fc0a30c8-be3a-4d54-b05b-d783eae0bf49.jpg",
    alt: "Wooden memorial keepsake box",
    description: "Personalized memorial boxes to treasure their legacy forever",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0d748c82-667e-44d4-9821-861b424484de.jpg",
    alt: "Granite memorial plaque",
    description: "Premium granite plaques with QR codes for lasting remembrance",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4083425e-6b78-4ec6-a1e4-fcc813bb2686.jpg",
    alt: "Woman visiting memorial with QR code",
    description: "Connect visitors to cherished memories with a simple scan",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/50e6a4f9-9a11-49fc-9168-716424a46c6f.jpg",
    alt: "Child scanning memorial QR code",
    description: "Share their story across generations with digital memorials",
  },
]

export function MemorialSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000) // 3 seconds per slide

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume autoplay after 5 seconds of manual navigation
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Slideshow */}
      <Link href="/checkout" className="block group cursor-pointer">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority={index === 0}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.preventDefault()
              prevSlide()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              nextSlide()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Description Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
      </Link>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
