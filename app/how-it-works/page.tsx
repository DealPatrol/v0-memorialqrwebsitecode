import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  QrCode,
  Upload,
  Smartphone,
  Heart,
  CheckCircle,
  ArrowRight,
  Globe,
  Shield,
  ShoppingCart,
  Music,
} from "lucide-react"
import type { Metadata } from "next"
import { HowToSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  title: "How It Works - Create a Digital Memorial in 4 Easy Steps | Memorial QR",
  description:
    "Learn how to create a digital memorial with QR code plaque in 4 simple steps. Choose package, build memorial, get QR code, share their story. No technical skills needed. Starting at $39.89.",
  keywords:
    "how memorial QR works, create digital memorial, QR code memorial process, memorial creation steps, how to make memorial, memorial tutorial, QR code grave marker how to",
  openGraph: {
    title: "How Memorial QR Works - Simple 4-Step Process",
    description:
      "Create a lasting digital memorial in minutes. Choose your package, upload content, receive your QR plaque, and share their story forever.",
    type: "website",
    url: "https://memorialsqr.com/how-it-works",
    images: [
      {
        url: "https://memorialsqr.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "How Memorial QR Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Create a Digital Memorial - 4 Easy Steps",
    description: "Choose package → Build memorial → Get QR code → Share their story",
    images: ["https://memorialsqr.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://memorialsqr.com/how-it-works",
  },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HowToSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://memorialsqr.com" },
          { name: "How It Works", url: "https://memorialsqr.com/how-it-works" },
        ]}
      />
      <ProductSchema />

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Simple Process</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How Memorial QR Works</h1>
          <p className="text-xl text-white/90 mb-8">
            Create a lasting digital memorial in just four simple steps. No account required to get started.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Link href="/store">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Choose Your Memorial Package</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Select from our premium memorial packages. Each order includes your choice of a gold, black, or silver
                  memorial plaque with a custom QR code. Add optional products like wooden keychains, picture plaques,
                  or stone QR codes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Premium memorial plaque included (gold, black, or silver)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Optional wooden QR keychain</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Optional picture plaque with QR code</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Optional stone QR code</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-first">
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <ShoppingCart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Package</h3>
                      <p className="text-gray-600">Choose the perfect memorial products for your loved one</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Memorial</h3>
                      <p className="text-gray-600">
                        Add photos, videos, voicemails, and stories immediately after checkout
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Create Your Memorial</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  After checkout, you'll be taken directly to create your memorial. No account required! Upload photos,
                  videos, voicemails, and write stories about your loved one. You can even add YouTube links for
                  favorite songs or videos.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Upload unlimited photos and videos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Add voicemails and audio messages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Embed YouTube videos and music</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Write personal stories and memories</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Get Your QR Code</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Once your memorial is complete, we generate a custom QR code that links directly to your memorial
                  page. Your QR code will be engraved on your memorial plaque and shipped to you. You can also download
                  it for other uses.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Custom QR code engraved on plaque</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>High-resolution download available</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Multiple file formats</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Optional account creation to manage memorial</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-first">
                <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom QR Code</h3>
                      <p className="text-gray-600">Get a beautiful QR code engraved on your memorial plaque</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Access</h3>
                      <p className="text-gray-600">Anyone can scan and view the memorial instantly on their phone</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Share Their Story</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Visitors can scan the QR code with their smartphone to instantly access your loved one's memorial
                  page. They can view photos, watch videos, listen to voicemails, read stories, and leave their own
                  messages. Create an optional account anytime to manage and update your memorial.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Works with any smartphone camera</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>No app download required</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Visitors can leave messages and memories</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Create account anytime to update memorial</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features Included</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every memorial comes with these essential features to honor your loved one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Unlimited Content</h3>
                <p className="text-sm text-gray-600">Upload unlimited photos, videos, voicemails, and stories</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Music className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Voicemails & Audio</h3>
                <p className="text-sm text-gray-600">Add voicemails, audio messages, and YouTube links</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Lifetime Hosting</h3>
                <p className="text-sm text-gray-600">Your memorial will be hosted forever</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Guest Messages</h3>
                <p className="text-sm text-gray-600">Visitors can leave condolences and memories</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Create a Memorial?</h2>
          <p className="text-xl text-white/90 mb-8">
            Start honoring your loved one today with a beautiful digital memorial that lasts forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/store">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/browse-memorials">View Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="memorial-logo text-xl font-bold">Memorial QR</span>
              </div>
              <p className="text-gray-400">Creating lasting digital memorials to honor and remember your loved ones.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/our-story" className="hover:text-white">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
