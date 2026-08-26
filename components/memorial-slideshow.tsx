"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const slides = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/db959b4e-7646-4003-b6e6-6fa8ea3f431b.jpeg",
    alt: "Memorial QR products display with plaques, necklace, and keychain",
    description: "Beautiful memorial QR products - plaques, necklaces, and keychains to honor your loved one",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a1be63e5-6538-4d42-9250-a9d76a8a754e.jpeg",
    alt: "Three memorial QR plaques in different finishes",
    description: "Choose from black, silver, or gold memorial QR plaques",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/df829b59-08c6-44a7-9667-65d1483327e9.jpeg",
    alt: "Stone memorial plaque with white rose and wooden keychain",
    description: "Elegant memorial stone plaque paired with wooden QR keychain",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2fb8ebb5-03da-4770-8bcf-480f1de6e781.jpeg",
    alt: "Memorial keepsake box with engraved message",
    description: "Personalized wooden memorial box to treasure precious keepsakes forever",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a2fb5ef4-2050-4706-a4c2-56f4eef83ebb.jpeg",
    alt: "Woman wearing wooden QR memorial necklace",
    description: "Keep their memory close with a beautiful wooden QR necklace",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/24e70872-240d-475d-a804-7b1e0c9b81d3.jpg",
    alt: "Child holding memorial QR keychain",
    description: "Share their story across generations with memorial QR keychains",
    objectPosition: "center 45%",
    scale: 0.75,
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1b96464e-9ee4-4159-ae59-c52cf9696d8f.jpg",
    alt: "Memorial plaque on vintage books",
    description: "Timeless memorial plaques that honor your loved one with dignity",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fc0a30c8-be3a-4d54-b05b-d783eae0bf49.jpg",
    alt: "Wooden memorial keepsake box",
    description: "Beautiful memorial boxes with QR codes for lasting remembrance",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0d748c82-667e-44d4-9821-861b424484de.jpg",
    alt: "Granite memorial plaque",
    description: "Premium granite plaques with QR codes for eternal remembrance",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4083425e-6b78-4ec6-a1e4-fcc813bb2686.jpg",
    alt: "Woman visiting memorial with QR code",
    description: "Connect visitors to cherished memories with a simple scan",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/50e6a4f9-9a11-49fc-9168-716424a46c6f.jpg",
    alt: "Child scanning memorial QR code",
    description: "Share their story and keep memories alive forever",
  },
]

export function MemorialSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  const openLightbox = () => {
    setIsLightboxOpen(true)
    setIsAutoPlaying(false)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setIsAutoPlaying(true)
  }

  return (
    <>
      <div className="relative max-w-2xl mx-auto">
        {/* Main Slideshow */}
        <div onClick={openLightbox} className="block group cursor-pointer w-full">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
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
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)",
                    objectPosition: slide.objectPosition || "center",
                    transform: slide.scale ? `scale(${slide.scale})` : undefined,
                  }}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevSlide()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
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
        </div>

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

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation in lightbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevSlide()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextSlide()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Enlarged image */}
          <div className="relative w-full max-w-6xl aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={slides[currentSlide].image || "/placeholder.svg"}
              alt={slides[currentSlide].alt}
              fill
              className="object-contain"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)",
                objectPosition: slides[currentSlide].objectPosition || "center",
                transform: slides[currentSlide].scale ? `scale(${slides[currentSlide].scale})` : undefined,
              }}
              priority
            />
            {/* Description in lightbox */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-xl md:text-2xl font-medium drop-shadow-lg">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
