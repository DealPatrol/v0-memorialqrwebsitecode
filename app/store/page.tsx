"use client"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Check, Info } from "lucide-react"

const products = [
  {
    id: "wooden-keychain-necklace",
    name: "Memorial QR Code Wooden Keychain or Necklace",
    price: 14.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 487,
    image: "/images/17c80bbb-d33f-4068-8656.jpeg",
    badge: "Best Seller",
    features: [
      "Natural wood with laser-engraved QR code",
      "Choose keychain or necklace option",
      "Includes keyring or silver chain",
      "Portable memorial keepsake",
    ],
    description:
      "Beautiful wooden memorial QR code charm - wear as a necklace or carry as a keychain. Laser-engraved natural wood keeps your loved one's memory close always.",
  },
  {
    id: "slate-memorial-coaster",
    name: "Memorial Slate Coaster with QR Code",
    price: 24.99,
    monthlyFee: 4.99,
    rating: 4.8,
    reviews: 203,
    image: "/images/slate-memorial-coaster.jpeg",
    badge: "Popular",
    features: [
      "Natural slate with laser engraving",
      "Custom memorial text included",
      "QR code for digital tribute",
      "Beautiful home keepsake",
    ],
    description:
      "Elegant natural slate memorial coaster featuring 'Gone But Never Forgotten' with personalized name, dates, and laser-engraved QR code linking to a digital memorial.",
  },
  {
    id: "memorial-photo-frame",
    name: "Memorial Photo Frame with QR Code",
    price: 49.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 156,
    image: "/images/0d120a50-1c8d-4a75-a564.jpeg",
    badge: "Premium",
    features: [
      "Displays cherished memorial photo",
      "Laser-engraved QR code plaque",
      "Elegant desktop or shelf display",
      "Personalized name engraving",
    ],
    description:
      "Beautiful memorial photo frame with integrated QR code plaque. Display your loved one's photo while providing instant access to their full digital memorial tribute.",
  },
]

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Memorial QR Code Products - Keep Memories Alive
            </h1>
            <p className="text-xl text-blue-100 text-pretty">
              Beautiful memorial products with QR codes that connect to personalized digital tributes. Honor your loved
              ones with lasting keepsakes.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-center text-muted-foreground">Showing {products.length} memorial products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-orange-500 text-white">{product.badge}</Badge>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="pb-3 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-blue-900">+ ${product.monthlyFee.toFixed(2)}/mo hosting</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/checkout/simple?product=${product.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <p className="text-muted-foreground">Memorials Created</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
