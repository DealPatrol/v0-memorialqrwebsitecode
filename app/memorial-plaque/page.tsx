import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Check, Star } from "lucide-react"
import { PRODUCTS, formatPrice } from "@/lib/products"

export const metadata: Metadata = {
  title: "Memorial Plaques with QR Code | Custom Memorial Markers | Memorial QR",
  description:
    "Shop custom memorial plaques with integrated QR codes. Silver, gold, and black finishes. Weather-resistant aluminum. Link to digital memorial with photos and videos.",
  keywords: [
    "memorial plaque",
    "QR code plaque",
    "custom memorial",
    "memorial marker",
    "grave plaque",
    "remembrance plaque",
    "memorial sign",
    "tribute plaque",
  ],
  openGraph: {
    title: "Memorial Plaques with QR Code | Custom Memorial Markers",
    description: "Custom memorial plaques with integrated QR codes linking to digital memorials.",
    url: "https://memorialsqr.com/memorial-plaque",
  },
  alternates: {
    canonical: "https://memorialsqr.com/memorial-plaque",
  },
}

export default function MemorialPlaquePage() {
  const plaques = PRODUCTS.filter((p) => p.category === "plaque")

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Memorial Plaques",
            description: "Custom memorial plaques with QR codes",
            itemListElement: plaques.map((plaque, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: plaque.name,
                description: plaque.description,
                offers: {
                  "@type": "Offer",
                  price: (plaque.priceInCents / 100).toFixed(2),
                  priceCurrency: "USD",
                },
              },
            })),
          }),
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Memorial Plaques</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Beautiful, weather-resistant plaques with laser-engraved QR codes. Each plaque links to a personalized
              digital memorial where you can share unlimited photos, videos, and stories.
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <span className="text-white ml-2">Rated 5 stars by families</span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plaques.map((plaque) => (
                <Card key={plaque.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative aspect-square">
                    <Image src={plaque.image || "/placeholder.svg"} alt={plaque.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">{plaque.name}</h2>
                    <p className="text-slate-600 mb-4">{plaque.description}</p>
                    <ul className="space-y-2 mb-6">
                      {plaque.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${formatPrice(plaque.priceInCents)}</span>
                      <Button asChild>
                        <Link href="/store">Add to Cart</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Memorial Plaques?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Weather-Resistant</h3>
                <p className="text-slate-600 text-sm">Built to withstand all weather conditions for years</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Laser Engraved</h3>
                <p className="text-slate-600 text-sm">Precision QR code that won't fade or wear off</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Easy Installation</h3>
                <p className="text-slate-600 text-sm">Mounting hardware included with every plaque</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">5-Year Guarantee</h3>
                <p className="text-slate-600 text-sm">We stand behind the quality of our products</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Create a Lasting Memorial Today</h2>
            <p className="text-slate-300 mb-8">Free shipping on all orders. 30-day money-back guarantee.</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">Shop All Plaques</Link>
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
