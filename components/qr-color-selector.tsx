"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type ColorOption = {
  id: string
  name: string
  description: string
  image: string
  popular?: boolean
  gradient: string
}

const colorOptions: ColorOption[] = [
  {
    id: "black",
    name: "Classic Black",
    description: "Elegant black finish with white QR code",
    image: "/qr-box-black.jpeg",
    gradient: "from-slate-900 to-slate-700",
  },
  {
    id: "gold",
    name: "Premium Gold",
    description: "Luxurious gold finish with black QR code",
    image: "/qr-box-gold.jpeg",
    popular: true,
    gradient: "from-yellow-600 to-yellow-500",
  },
  {
    id: "silver",
    name: "Modern Silver",
    description: "Sleek silver finish with black QR code",
    image: "/qr-box-silver.jpeg",
    gradient: "from-slate-400 to-slate-300",
  },
]

export function QRColorSelector() {
  const [selectedColor, setSelectedColor] = useState<string>("gold")

  const selectedOption = colorOptions.find((opt) => opt.id === selectedColor)

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-12">
        <Badge className="bg-purple-500 text-white px-4 py-2 text-sm mb-4">
          <Sparkles className="h-4 w-4 mr-2" />
          Customize Your Memorial
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your QR Code Box Style</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Select from three premium finishes for your memorial QR code box. Each option includes a custom engraved QR
          code and personalized text.
        </p>
      </div>

      {/* Color Selection Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {colorOptions.map((option) => (
          <Card
            key={option.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedColor === option.id ? "ring-4 ring-blue-500 shadow-2xl scale-105" : "hover:scale-102"
            }`}
            onClick={() => setSelectedColor(option.id)}
          >
            {option.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 shadow-lg">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardContent className="p-0">
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100">
                <Image
                  src={option.image || "/placeholder.svg"}
                  alt={option.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {selectedColor === option.id && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>

              {/* Color Info */}
              <div className="p-6">
                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${option.gradient} mb-4`} />
                <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Preview & CTA */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Preview */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Your Selection:</h3>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${selectedOption?.gradient}`} />
                  <div>
                    <h4 className="text-xl font-bold">{selectedOption?.name}</h4>
                    <p className="text-gray-600 text-sm">{selectedOption?.description}</p>
                  </div>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedOption?.image || ""}
                    alt={selectedOption?.name || ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Complete Memorial Package</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Custom engraved QR code box in {selectedOption?.name.toLowerCase()}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Personalized memorial website with unlimited photos</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Lifetime access with no monthly fees</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Family collaboration and guest messages</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-3">Starting at:</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-slate-900">$1.00</span>
                </div>
                <p className="text-sm text-gray-600">Choose from 3 package tiers</p>
              </div>

              <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                <Link href="/pricing">View Packages</Link>
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                ✓ Secure checkout • ✓ Ships within 5-7 business days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Product Info */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">Premium Materials</h4>
            <p className="text-sm text-gray-600">High-quality finishes designed to last for generations</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Custom Engraving</h4>
            <p className="text-sm text-gray-600">Personalized text and QR code laser engraved</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/qr-box-wood.jpeg" alt="Box" width={24} height={24} className="object-contain" />
            </div>
            <h4 className="font-semibold mb-2">Beautiful Presentation</h4>
            <p className="text-sm text-gray-600">Arrives in an elegant keepsake box</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
