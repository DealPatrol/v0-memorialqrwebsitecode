import { Header } from "@/components/header"
import QrCustomizer from "@/components/qr-customizer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Palette, Download, Smartphone, Headphones, CreditCard } from "lucide-react"
import Link from "next/link"

export default function QrGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
              <QrCode className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create Custom <span className="memorial-logo">Memorial QR</span> Codes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Design beautiful, personalized QR codes for headstones, plaques, and memorial cards. Choose from 8 colors
            and 3 styles to match your memorial perfectly.
          </p>
        </div>
      </section>

      {/* QR Customizer */}
      <section className="pb-16">
        <QrCustomizer />
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Professional QR Code Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">8 Professional Colors</h3>
                <p className="text-gray-600">
                  Choose from carefully selected colors including black, navy, forest green, purple, burgundy, gray,
                  teal, and brown.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3 Elegant Styles</h3>
                <p className="text-gray-600">
                  Select from standard squares, elegant dots, or rounded corners to match your memorial aesthetic.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">High-Quality Download</h3>
                <p className="text-gray-600">
                  Download 300x300px PNG files perfect for printing on headstones, plaques, and memorial cards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perfect for Any Memorial</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                  <Headphones className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="font-semibold text-lg">Headstones</h3>
              </div>
              <p className="text-gray-600">
                Weather-resistant QR codes that last for generations on granite and marble.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="font-semibold text-lg">Memorial Plaques</h3>
              </div>
              <p className="text-gray-600">Elegant QR codes for bronze, brass, and aluminum memorial plaques.</p>
            </div>

            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="font-semibold text-lg">Memorial Cards</h3>
              </div>
              <p className="text-gray-600">Beautiful QR codes for funeral programs, prayer cards, and keepsakes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold mb-2">Enter URL</h3>
              <p className="text-sm text-gray-600">Paste your memorial page URL</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold mb-2">Customize</h3>
              <p className="text-sm text-gray-600">Choose color and style</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold mb-2">Preview</h3>
              <p className="text-sm text-gray-600">See your QR code instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold mb-2">Download</h3>
              <p className="text-sm text-gray-600">Get high-quality PNG file</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Memorial?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with a custom QR code, then build a beautiful digital memorial that lasts forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              <Link href="/browse-memorials">See Sample Memorials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6" />
                <span className="memorial-logo text-xl">Memorial QR</span>
              </div>
              <p className="text-gray-400 text-sm">Creating lasting digital memorials with beautiful QR codes.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/qr-generator" className="hover:text-white">
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Memorial Plans
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Browse Memorials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
