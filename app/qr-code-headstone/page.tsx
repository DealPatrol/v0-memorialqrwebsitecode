import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { QrCode, Smartphone, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "QR Code for Headstone | Cemetery Memorial QR Codes | Memorial QR",
  description:
    "Add a QR code to any headstone or grave marker. Weather-resistant memorial plaques link to unlimited photos, videos, and stories. Easy cemetery installation.",
  keywords: [
    "QR code headstone",
    "cemetery QR code",
    "grave marker QR",
    "headstone memorial",
    "grave QR code",
    "cemetery technology",
    "memorial plaque QR",
    "gravesite QR code",
  ],
  openGraph: {
    title: "QR Code for Headstone | Cemetery Memorial QR Codes",
    description: "Add a scannable QR code to any headstone. Link to unlimited photos, videos, and memories.",
    url: "https://memorialsqr.com/qr-code-headstone",
  },
  alternates: {
    canonical: "https://memorialsqr.com/qr-code-headstone",
  },
}

export default function QRCodeHeadstonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "QR Code Headstone Plaque",
            description: "Weather-resistant QR code plaque for headstones and grave markers",
            brand: { "@type": "Brand", name: "Memorial QR" },
            offers: {
              "@type": "Offer",
              price: "39.89",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-100 to-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">QR Code for Headstones</h1>
                <p className="text-lg text-slate-600 mb-8">
                  Transform any headstone into an interactive memorial. Our weather-resistant QR plaques attach easily
                  to existing grave markers and link visitors to a rich digital tribute with unlimited photos, videos,
                  and stories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/store">Shop QR Plaques</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/how-it-works">See How It Works</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/qr-code-memorial-plaque-on-headstone.jpg"
                  alt="QR code plaque installed on a headstone"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Add a QR Code to a Headstone?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <QrCode className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                  <h3 className="font-bold text-lg mb-2">Unlimited Content</h3>
                  <p className="text-slate-600">
                    Headstones have limited space. QR codes link to unlimited photos, videos, and stories.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                  <h3 className="font-bold text-lg mb-2">Easy to Use</h3>
                  <p className="text-slate-600">
                    Visitors simply scan with their phone camera. No app download required.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                  <h3 className="font-bold text-lg mb-2">Weather-Resistant</h3>
                  <p className="text-slate-600">
                    Our plaques withstand rain, snow, sun, and temperature extremes for years.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Install */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Easy Cemetery Installation</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Check Cemetery Policy</h3>
                    <p className="text-slate-600">
                      Most cemeteries allow QR plaques. We provide documentation to support your request if needed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Choose Your Plaque</h3>
                    <p className="text-slate-600">
                      Select from adhesive-mount, stake-mount, or bracket-mount options depending on your needs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Install & Create Memorial</h3>
                    <p className="text-slate-600">
                      Attach the plaque, scan the QR code, and build their digital memorial with photos and stories.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create a QR Memorial?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Starting at just $39.89, our QR plaques transform any headstone into an interactive tribute.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">Shop Now</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400">&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
