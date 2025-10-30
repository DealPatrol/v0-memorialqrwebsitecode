import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { QrCode, Upload, Smartphone, Heart, CheckCircle, ArrowRight, Users, Globe, Shield } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">Simple Process</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How Memorial QR Works</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create a lasting digital memorial in just three simple steps. No technical knowledge required.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Link href="/pricing">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Create Your Memorial</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Start by uploading photos, videos, and writing stories about your loved one. Our easy-to-use interface
                  guides you through creating a beautiful memorial page that captures their life and legacy.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Upload unlimited photos and videos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Write personal stories and memories</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Add biographical information</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Invite family members to contribute</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-first">
                <Card className="p-8 bg-white border-2 border-purple-200 shadow-xl">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <Upload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Memorial Creation</h3>
                      <p className="text-gray-600">
                        Our intuitive interface makes it easy to build a comprehensive memorial
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="p-8 bg-white border-2 border-purple-200 shadow-xl">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom QR Code</h3>
                      <p className="text-gray-600">Get a beautiful, customizable QR code that links to your memorial</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Get Your QR Code</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Once your memorial is complete, we generate a custom QR code that links directly to your memorial
                  page. You can customize the design and download it in high resolution for your memorial plaque.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>High-resolution QR code download</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Customizable design options</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Multiple file formats available</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Perfect for engraving on plaques</span>
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
                  <h2 className="text-3xl font-bold text-gray-900">Share Their Story</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Visitors can scan the QR code with their smartphone to instantly access your loved one's memorial
                  page. They can view photos, watch videos, read stories, and even leave their own messages and
                  memories.
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
                    <span>Visitors can leave messages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Share memories with family</span>
                  </li>
                </ul>
              </div>
              <div className="lg:order-first">
                <Card className="p-8 bg-white border-2 border-purple-200 shadow-xl">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <Smartphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Access</h3>
                      <p className="text-gray-600">Anyone can scan and view the memorial instantly on their phone</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features Included</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every memorial comes with these essential features to honor your loved one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-0">
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Unlimited Content</h3>
                <p className="text-sm text-gray-600">Upload unlimited photos, videos, and stories</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-0">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Family Collaboration</h3>
                <p className="text-sm text-gray-600">Invite family members to contribute content</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-0">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Lifetime Hosting</h3>
                <p className="text-sm text-gray-600">Your memorial will be hosted forever</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Create a Memorial?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start honoring your loved one today with a beautiful digital memorial that lasts forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/pricing">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
            >
              <Link href="/browse-memorials">View Examples</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
