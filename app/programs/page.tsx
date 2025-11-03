"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Heart, Users, Music, ImageIcon, MessageCircle, Share2, Download, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function Programs() {
  const [boxMessage, setBoxMessage] = useState("")

  const features = [
    { icon: Heart, title: "Beautiful Memorial Page", description: "Personalized tribute with photos and memories" },
    { icon: Users, title: "Family Tree Display", description: "Visual representation of family connections" },
    { icon: Music, title: "Memorial Music", description: "Add meaningful songs and audio memories" },
    { icon: ImageIcon, title: "Photo Gallery", description: "Unlimited photo uploads and organization" },
    { icon: MessageCircle, title: "Guest Messages", description: "Allow visitors to leave condolences and memories" },
    { icon: Share2, title: "Easy Sharing", description: "Share memorial link with family and friends" },
    { icon: Download, title: "QR Code Generation", description: "Custom QR codes for easy access" },
    { icon: Smartphone, title: "Mobile Optimized", description: "Perfect viewing on all devices" },
  ]

  const colorOptions = [
    {
      name: "Classic Black",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-uzcKSInG8bp4K2tta5njv5Mb0s2QMN.jpg",
      description: "Elegant black finish with white QR code",
    },
    {
      name: "Premium Gold",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gold-YKcMRbRzoprn4nOPSLASZgVAG0oK7f.jpg",
      description: "Luxurious gold finish with black QR code",
    },
    {
      name: "Modern Silver",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/silver-5qPRpDXC2vLxCx2OV9fu8LHUeo1y0y.jpg",
      description: "Sleek silver finish with black QR code",
    },
  ]

  const additionalProducts = [
    {
      name: "Wooden QR Code",
      description: "Natural wood finish with laser-engraved QR code",
      price: 29.97,
      image: "/wooden-keychain.png",
    },
    {
      name: "Picture Plaque",
      description: "Custom photo plaque with memorial details",
      price: 39.98,
      image: "/aluminum-card.jpg",
    },
    {
      name: "Stone QR Code",
      description: "Durable stone memorial with engraved QR code",
      price: 56.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e4de3d0a-3087-4815-924d-3bcb93c7a20d.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Memorial Products</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Create a lasting digital tribute to honor your loved one's memory
          </p>
        </div>
      </div>

      {/* Main Package - Reduced spacing */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Badge className="bg-blue-500 text-white px-4 py-2 text-sm mb-3">
              <Star className="h-4 w-4 mr-2" />
              Most Popular
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Complete Memorial Package</h2>
            <p className="text-gray-600 text-lg">Everything you need to create a beautiful digital memorial</p>
          </div>

          <Card className="border-2 border-blue-200 shadow-xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-slate-50 pb-6">
              <CardTitle className="text-4xl font-bold text-slate-900 mb-2">$129.99</CardTitle>
              <p className="text-gray-600">One-time payment • Lifetime access</p>
              <p className="text-sm text-blue-600 font-semibold mt-2">
                Includes your choice of Gold, Black, or Silver memorial plaque
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-3">Perfect For:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Families wanting to honor a loved one
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Sharing memories with distant relatives
                    </li>
                    <li className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      Creating a lasting digital legacy
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-500" />
                      Easy access via QR codes
                    </li>
                  </ul>

                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <h4 className="font-medium text-slate-900 mb-2 text-sm">Lifetime Benefits:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• No monthly fees or subscriptions</li>
                      <li>• Unlimited photo and story uploads</li>
                      <li>• 24/7 access from anywhere</li>
                      <li>• Mobile-friendly design</li>
                      <li>• Secure and private</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  <Link href="/checkout">Get Started - $129.99</Link>
                </Button>
                <p className="text-sm text-gray-500 mt-2">30-day money-back guarantee • Secure payment processing</p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">Choose Your Memorial Plaque</h2>
              <p className="text-gray-600">
                Every order includes one premium aluminum plaque (weatherproof & built to last)
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {colorOptions.map((option, index) => (
                <Card key={index} className="border-2 hover:border-blue-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-[4/3] relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={option.image || "/placeholder.svg"}
                        alt={option.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-center mb-1">{option.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">Additional Products</h2>
              <p className="text-gray-600">Enhance your memorial with these optional add-ons</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {additionalProducts.map((product, index) => (
                <Card key={index} className="border-2 hover:border-blue-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-[4/3] relative mb-3 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-center mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 text-center mb-2">{product.description}</p>
                    <p className="text-xl font-bold text-center text-blue-600">${product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Honor Your Loved One?</h2>
          <p className="text-xl text-slate-200 mb-6 max-w-2xl mx-auto">
            Create a beautiful, lasting memorial that celebrates their life and keeps their memory alive forever.
          </p>
          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
            <Link href="/checkout">Start Creating Memorial - $129.99</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
