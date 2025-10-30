"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Heart, Users, Music, ImageIcon, MessageCircle, Share2, Download, Smartphone } from "lucide-react"
import Link from "next/link"

export default function Programs() {
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
              <CardTitle className="text-4xl font-bold text-slate-900 mb-2">$149</CardTitle>
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
                  <Link href="/pricing">Get Started - $149</Link>
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
            <Link href="/pricing">Start Creating Memorial - $149</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
