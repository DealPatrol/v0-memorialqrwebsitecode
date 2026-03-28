import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { ImageIcon, Video, Music, BookOpen, Users, Globe, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Digital Memorial | Online Tribute & Memorial Website | Memorial QR",
  description:
    "Create a beautiful digital memorial website. Upload unlimited photos, videos, and stories. Share with family worldwide. Accessible via QR code or direct link.",
  keywords: [
    "digital memorial",
    "online memorial",
    "memorial website",
    "online tribute",
    "virtual memorial",
    "digital obituary",
    "memorial page",
    "online grave",
  ],
  openGraph: {
    title: "Digital Memorial | Online Tribute & Memorial Website",
    description: "Create a beautiful digital memorial with unlimited photos, videos, and stories.",
    url: "https://memorialsqr.com/digital-memorial",
  },
  alternates: {
    canonical: "https://memorialsqr.com/digital-memorial",
  },
}

export default function DigitalMemorialPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Digital Memorial Website",
            description: "Online memorial service with unlimited photos, videos, and stories",
            provider: {
              "@type": "Organization",
              name: "Memorial QR",
            },
            offers: {
              "@type": "Offer",
              price: "4.99",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "4.99",
                priceCurrency: "USD",
                unitText: "MONTH",
              },
            },
          }),
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Digital Memorials</h1>
                <p className="text-lg text-slate-600 mb-6">
                  Create a lasting online tribute that brings together photos, videos, stories, and memories. Accessible
                  from anywhere in the world via QR code or direct link.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Unlimited photos and videos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Family can contribute memories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Private or public sharing options</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Just $4.99/month hosting</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/store">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/browse-memorials">View Examples</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-slate-100">
                <Image
                  src="/digital-memorial-website-example-photos-videos.jpg"
                  alt="Digital memorial website example"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What You Can Include</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <ImageIcon className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2">Unlimited Photos</h3>
                  <p className="text-slate-600">Upload as many photos as you want from every stage of their life.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Video className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2">Videos</h3>
                  <p className="text-slate-600">Share video memories, celebrations, and messages from loved ones.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Music className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2">Music & Audio</h3>
                  <p className="text-slate-600">Add their favorite songs or voice recordings to the memorial.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <BookOpen className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2">Life Story</h3>
                  <p className="text-slate-600">Write their biography, timeline, and cherished memories.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2">Family Contributions</h3>
                  <p className="text-slate-600">Invite family members to add their own photos and stories.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Globe className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg mb-2">Global Access</h3>
                  <p className="text-slate-600">Share with anyone, anywhere via link or QR code scan.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Simple, Affordable Pricing</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-5xl font-bold mb-2">$4.99</div>
                <div className="text-slate-600 mb-6">per month</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    Unlimited photo storage
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    Video hosting included
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    Custom memorial page
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    Family collaboration
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    Cancel anytime
                  </li>
                </ul>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/store">Get Your QR Plaque</Link>
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                  Purchase a QR plaque first, then activate your memorial website when it arrives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400">&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
