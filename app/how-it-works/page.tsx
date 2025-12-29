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
  User,
  PawPrint,
} from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Simple Process</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How Memorial QR Works</h1>
          <p className="text-xl text-white/90 mb-8">
            Create a lasting tribute for loved ones or beloved pets in just four simple steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/pricing">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Memorial Type Selection */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Choose Your Memorial Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
              <Link href="/human-memorials">
                <CardContent className="p-6 text-center">
                  <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Human Memorials</h3>
                  <p className="text-sm text-muted-foreground">For loved ones who have passed</p>
                </CardContent>
              </Link>
            </Card>
            <Card className="border-2 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer">
              <Link href="/pet-memorials">
                <CardContent className="p-6 text-center">
                  <PawPrint className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Pet Memorials</h3>
                  <p className="text-sm text-muted-foreground">For beloved furry friends</p>
                </CardContent>
              </Link>
            </Card>
          </div>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Choose Your Memorial</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Select the type of memorial you want to create — for a loved one or a beloved pet. Choose from
                  headstone plaques, wall displays, collar tags, garden stones, or keepsake boxes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Human memorials with dignified plaques</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Pet memorials with collar tags or garden stones</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>All products include custom QR code</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-first">
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <ShoppingCart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Package</h3>
                      <p className="text-gray-600">Choose the perfect memorial products</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <Upload className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Their Profile</h3>
                      <p className="text-gray-600">Add photos, videos, and memories</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Create Their Profile</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Upload photos spanning their life, add videos, audio recordings, and write their story. For humans,
                  include biography and family tree. For pets, add their personality and favorite things.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Upload unlimited photos and videos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Add voice recordings or favorite songs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Write their complete life story</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Receive Your Memorial</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  We'll ship your custom engraved QR plaque or tag. Our products are designed to withstand outdoor
                  conditions for headstones, gardens, or wherever you choose to place them.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Custom QR code engraved on plaque or tag</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Weather-resistant and durable materials</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Free shipping on all orders</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-first">
                <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom QR Memorial</h3>
                      <p className="text-gray-600">Beautiful, durable, and meaningful</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <Smartphone className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Scanning</h3>
                      <p className="text-gray-600">Anyone can scan to see their story</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Share Their Legacy</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Visitors can scan the QR code to instantly view the memorial page. They can see photos, videos, and
                  stories — and leave their own condolences and memories.
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
              Every memorial comes with these essential features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Unlimited Memories</h3>
                <p className="text-sm text-gray-600">Upload unlimited photos and videos</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Music className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Audio Tributes</h3>
                <p className="text-sm text-gray-600">Add voice recordings and favorite songs</p>
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
                <p className="text-sm text-gray-600">Visitors can leave condolences</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Create a Memorial?</h2>
          <p className="text-xl text-white/90 mb-8">
            Start honoring your loved ones today with a beautiful digital memorial that lasts forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/pricing">
                View Packages
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="memorial-logo text-xl font-bold">Memorial QR</span>
              </div>
              <p className="text-gray-400">
                Creating lasting digital memorials to honor and remember loved ones — both human and pet.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/human-memorials" className="hover:text-white">
                    Human Memorials
                  </Link>
                </li>
                <li>
                  <Link href="/pet-memorials" className="hover:text-white">
                    Pet Memorials
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
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
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
