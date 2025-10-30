"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Check,
  Star,
  Heart,
  Users,
  Music,
  ImageIcon,
  MessageCircle,
  Share2,
  Download,
  Smartphone,
  Shield,
  Package,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function Programs() {
  const [boxMessage, setBoxMessage] = useState("")

  const features = [
    { icon: Heart, title: "Beautiful Memorial Page", description: "Personalized tribute with photos and memories" },
    { icon: Users, title: "Family Tree Display", description: "Visual representation of family connections" },
    { icon: Music, title: "Audio Memories", description: "Add voicemails, recordings, and audio clips" },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Memorial Programs</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Create a lasting digital tribute to honor your loved one's memory
          </p>
        </div>
      </div>

      {/* Color Selection Section */}
      <div className="bg-white py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plaque Color</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                All memorial plaques are crafted from premium aluminum and are completely weatherproof
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Built to last outdoors in any weather condition</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {colorOptions.map((option, index) => (
                <Card key={index} className="border-2 hover:border-blue-400 transition-colors cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="aspect-[4/3] relative mb-4 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={option.image || "/placeholder.svg"}
                        alt={option.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">{option.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Premium Aluminum Construction</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our memorial plaques are manufactured from high-grade aluminum, making them completely weatherproof
                    and ideal for outdoor environments. They resist rust, corrosion, and fading, ensuring your loved
                    one's memorial remains beautiful for years to come, regardless of weather conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keepsake Box Personalization Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-amber-500 text-white px-4 py-2 text-sm mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Included with Every Order
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Custom Engraved Keepsake Box</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your memorial plaque arrives in a beautiful, personalized wooden keepsake box with your custom message
                laser-engraved on the lid
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Box Image */}
              <div className="order-2 md:order-1">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/design-mode/box1.jpg"
                    alt="Custom engraved wooden keepsake box"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Package className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Premium Wood</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Sparkles className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Laser Engraved</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Heart className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">One-of-a-Kind</p>
                  </div>
                </div>
              </div>

              {/* Personalization Form */}
              <div className="order-1 md:order-2">
                <Card className="border-2 border-amber-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                      Personalize Your Box
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Included with Every Plaque</h3>
                          <p className="text-sm text-gray-700">
                            Each memorial plaque is carefully packaged and shipped inside this custom wooden keepsake
                            box, making it a cherished part of your memorial experience.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="box-message" className="text-base font-semibold mb-2 block">
                          Your Custom Message
                        </Label>
                        <Textarea
                          id="box-message"
                          placeholder="In Memory of [Name]&#10;Forever in Our Hearts&#10;[Dates or Special Message]"
                          value={boxMessage}
                          onChange={(e) => setBoxMessage(e.target.value)}
                          className="min-h-[120px] text-base resize-none"
                          maxLength={150}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {boxMessage.length}/150 characters • We'll engrave exactly what you write
                        </p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-600" />
                          Popular Message Ideas:
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• "In Memory of [Name]" with dates</li>
                          <li>• "Forever in Our Hearts" with a heart symbol</li>
                          <li>• A meaningful quote or Bible verse</li>
                          <li>• "Loving Memory of [Name]" with family names</li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Your personalized box will be ready to ship within 3-5 business days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Why This Box is Special
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Unique to You:</strong> Each box is custom-made with your personal message
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Heirloom Quality:</strong> Crafted from premium wood to last generations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>Perfect Presentation:</strong> Protects your plaque and makes a beautiful keepsake
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>
                        <strong>No Extra Cost:</strong> Included free with every memorial plaque order
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Program */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-500 text-white px-4 py-2 text-sm mb-4">
              <Star className="h-4 w-4 mr-2" />
              Most Popular
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Complete Memorial Package</h2>
            <p className="text-gray-600 text-lg">Everything you need to create a beautiful digital memorial</p>
          </div>

          <Card className="border-2 border-blue-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-slate-50 pb-8">
              <CardTitle className="text-4xl font-bold text-slate-900 mb-2">$2</CardTitle>
              <p className="text-gray-600">One-time payment • Lifetime access</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">What's Included:</h3>
                  <div className="space-y-4">
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

                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Perfect For:</h3>
                  <ul className="space-y-3 text-gray-700">
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

                  <div className="mt-6 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-slate-900 mb-2">Lifetime Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• No monthly fees or subscriptions</li>
                      <li>• Unlimited photo and story uploads</li>
                      <li>• 24/7 access from anywhere</li>
                      <li>• Mobile-friendly design</li>
                      <li>• Secure and private</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  <Link href="/pricing">Get Started - $2</Link>
                </Button>
                <p className="text-sm text-gray-500 mt-3">30-day money-back guarantee • Secure payment processing</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Easy Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our simple step-by-step process helps you create a beautiful memorial in minutes, not hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Family Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Multiple family members can contribute photos, stories, and memories to create a complete tribute.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  QR Code Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate custom QR codes for headstones, funeral programs, or sharing with family and friends.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">How long does it take to set up a memorial?</h3>
                <p className="text-gray-600">
                  Most families complete their memorial setup in 15-30 minutes. You can always add more content later.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can multiple family members contribute?</h3>
                <p className="text-gray-600">
                  Yes! Family members can sign in and add photos, stories, and messages to the memorial.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there a limit on photos or content?</h3>
                <p className="text-gray-600">No limits! Upload as many photos, stories, and memories as you'd like.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do QR codes work?</h3>
                <p className="text-gray-600">
                  We generate a custom QR code that links directly to the memorial. Perfect for headstones, programs, or
                  sharing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is my memorial private or public?</h3>
                <p className="text-gray-600">
                  You control the privacy settings. Make it public for anyone to view, or private for family only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Honor Your Loved One?</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Create a beautiful, lasting memorial that celebrates their life and keeps their memory alive forever.
          </p>
          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
            <Link href="/pricing">Start Creating Memorial - $2</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
