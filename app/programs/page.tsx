"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Heart, Users, Music, ImageIcon, MessageCircle, Share2, Download, Smartphone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Programs() {
  const [boxMessage, setBoxMessage] = useState("")

  const features = [
    { icon: Heart, title: "Beautiful Memorial Page", description: "Personalized tribute with photos and memories" },
    { icon: Users, title: "Family Tree Display", description: "Visual representation of family connections" },
    { icon: Music, title: "Voicemails & Audio", description: "Add meaningful songs, voicemails, and audio memories" },
    { icon: ImageIcon, title: "Photo Gallery", description: "Unlimited photo uploads and organization" },
    { icon: MessageCircle, title: "Guest Messages", description: "Allow visitors to leave condolences and memories" },
    { icon: Share2, title: "Easy Sharing", description: "Share memorial link with family and friends" },
    { icon: Download, title: "QR Code Generation", description: "Custom QR codes for easy access" },
    { icon: Smartphone, title: "Mobile Optimized", description: "Perfect viewing on all devices" },
  ]

  const colorOptions = [
    {
      name: "Classic Black",
      image: "/images/black.jpg",
      description: "Elegant black finish with white QR code",
    },
    {
      name: "Premium Gold",
      image: "/images/gold.jpg",
      description: "Luxurious gold finish with black QR code",
    },
    {
      name: "Modern Silver",
      image: "/images/silver.jpg",
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
      image: "/images/e4de3d0a-3087-4815-924d.jpg",
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
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Memorial Package</h2>
          <p className="text-xl text-gray-600">Select the package that best honors your loved one's memory</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Basic</CardTitle>
              <CardTitle className="text-4xl font-bold text-slate-900 mb-2">$89.89</CardTitle>
              <p className="text-sm text-gray-600">Perfect for simple memorials</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />3 videos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  10 voicemails/audio
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  30 photos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Unlimited guest messages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Custom QR code
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />1 memorial plaque
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/checkout?package=basic">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-4 border-blue-500 shadow-2xl scale-105">
            <div className="text-center pt-4">
              <Badge className="bg-blue-500 text-white">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Standard</CardTitle>
              <CardTitle className="text-4xl font-bold text-slate-900 mb-2">$129.89</CardTitle>
              <p className="text-sm text-gray-600">Best value for families</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />5 videos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  15 voicemails/audio
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  50 photos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Unlimited guest messages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Custom QR code
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />1 memorial plaque
                </li>
              </ul>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/checkout?package=standard">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Premium</CardTitle>
              <CardTitle className="text-4xl font-bold text-slate-900 mb-2">$199.89</CardTitle>
              <p className="text-sm text-gray-600">Complete memorial experience</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  10 videos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  30 voicemails/audio
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  100 photos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />3 plaques OR wooden keychain
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Unlimited guest messages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Custom QR code
                </li>
              </ul>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/checkout?package=premium">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
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
            <Link href="/checkout">Start Creating Memorial - $89.89</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
