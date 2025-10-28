"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { CheckCircle, Sparkles, QrCode, Share2, Eye, Download, ArrowRight } from "lucide-react"

export default function SampleMemorialCreatedPage() {
  const searchParams = useSearchParams()
  const memorialId = searchParams.get("id") || "SAMPLE-123456789"

  const sampleMemorialUrl = `https://memorial-qr.com/memorial/${memorialId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sampleMemorialUrl)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Success Header */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <CheckCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sample Memorial Created!</h1>
            <p className="text-xl opacity-90 mb-6">
              Your demo memorial has been successfully created and is ready for testing and showcase purposes.
            </p>

            <Badge className="bg-white/20 text-white px-6 py-3 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Memorial ID: {memorialId}
            </Badge>
          </div>
        </div>
      </section>

      {/* Memorial Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code & Access */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-6 h-6 text-purple-600" />
                    Memorial QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
                    <img src={qrCodeUrl || "/placeholder.svg"} alt="Memorial QR Code" className="w-48 h-48 mx-auto" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Scan this QR code to view the memorial</p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-purple-600 hover:bg-purple-700 flex-1">
                        <Link href={`/memorial/${memorialId}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Memorial
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = qrCodeUrl
                          link.download = `memorial-qr-${memorialId}.png`
                          link.click()
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Memorial Info */}
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-green-600" />
                    Sample Memorial Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Digital memorial page created</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>QR code generated and ready</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Photos and videos uploaded</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Biography and life story added</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Family information included</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Guest message board enabled</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
                    <p className="text-sm text-purple-700">
                      <strong>Demo Notice:</strong> This is a sample memorial for demonstration purposes. No payment was
                      required. Perfect for testing and showcasing the memorial system.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Share & Next Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Share Your Sample Memorial</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6">
                <Share2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Share the Link</h3>
                <p className="text-slate-600 text-sm mb-4">Copy and share the memorial URL with family and friends</p>
                <div className="bg-slate-100 p-3 rounded text-xs break-all">{sampleMemorialUrl}</div>
              </Card>

              <Card className="p-6">
                <QrCode className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Print QR Code</h3>
                <p className="text-slate-600 text-sm mb-4">Download and print the QR code for physical placement</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = qrCodeUrl
                    link.download = `memorial-qr-${memorialId}.png`
                    link.click()
                  }}
                >
                  Download QR Code
                </Button>
              </Card>

              <Card className="p-6">
                <Eye className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Test & Demo</h3>
                <p className="text-slate-600 text-sm mb-4">Use this sample to demonstrate the memorial system</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/memorial/${memorialId}`}>View Memorial</Link>
                </Button>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Create a Real Memorial?</h3>
              <p className="text-lg opacity-90 mb-6">
                When you're ready to create an actual memorial with physical QR plaque, check out our pricing plans and
                complete the purchase process.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Link href="/pricing">
                    View Pricing Plans
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                >
                  <Link href="/create-sample-memorial">Create Another Sample</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-slate-400 text-sm">Honoring memories with digital memorials that last forever.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
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
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
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

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
