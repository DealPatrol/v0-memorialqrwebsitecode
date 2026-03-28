"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink, Heart } from "lucide-react"

export function FeaturedMemorialPreview() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-16 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See a Memorial in Action</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Experience how families are honoring their loved ones with interactive digital memorials
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card
            className="bg-zinc-800 border-zinc-700 overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src="/images/12ad3a4b-3655-4428-adba.jpeg"
                    alt="Glenda Jane Kelso Memorial"
                    fill
                    className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : ""}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/80 text-sm">In Loving Memory</p>
                    <h3 className="text-white text-2xl font-bold">Glenda Jane Kelso</h3>
                    <p className="text-white/70 text-sm">July 27, 1952 - August 27, 2025</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-sm">247 visitors have paid respects</span>
                    </div>

                    <p className="text-zinc-300">
                      This memorial showcases photos, life stories, and cherished memories shared by family and friends.
                      Scan the QR code or click to visit.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button asChild className="gap-2">
                        <Link href="/memorial/glenda-kelso">
                          <Play className="w-4 h-4" />
                          View Memorial
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="gap-2 border-zinc-600 bg-transparent">
                        <Link href="#product-selector">
                          <ExternalLink className="w-4 h-4" />
                          Create Your Own
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
