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
    id: "memorial-locket",
    name: "Vintage Flower of Life Urn Necklace with Mini Jar Cremation Locket",
    price: 39.99,
    monthlyFee: 4.99,
    rating: 5.0,
    reviews: 89,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04933625-2735-47aa-b480-d34dc7292a74.jpeg",
    badge: "Most Popular",
    category: "Human",
    features: [
      "Stainless steel filigree design with opening compartment",
      "Holds cremated ashes securely and safely",
      "Includes QR code linking to digital memorial",
      "Rose gold and silver finish options",
    ],
    description:
      "Stainless steel ash-filled memorial pendant featuring the sacred Flower of Life design. This elegant cremation urn necklace opens to hold a small amount of ashes or precious mementos. Perfect for women and men, this durable jewelry piece includes a QR code linking to your loved one's complete digital memorial, combining timeless design with modern technology for lasting remembrance.",
  },
  {
    id: "wooden-keychain-necklace",
    name: "Memorial QR Code Wooden Keychain or Necklace",
    price: 14.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 487,
    image: "/images/17c80bbb-d33f-4068-8656.jpeg",
    badge: "Best Seller",
    category: "Human",
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
    category: "Human",
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
    category: "Human",
    features: [
      "Displays cherished memorial photo",
      "Laser-engraved QR code plaque",
      "Elegant desktop or shelf display",
      "Personalized name engraving",
    ],
    description:
      "Beautiful memorial photo frame with integrated QR code plaque. Display your loved one's photo while providing instant access to their full digital memorial tribute.",
  },
  {
    id: "human-cremation-urn-wood",
    name: "Wooden Cremation Urn with QR Memorial Plaque",
    price: 89.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 312,
    image: "/images/human-cremation-urn-wood.jpg",
    badge: "Premium",
    category: "Human",
    features: [
      "Solid wood construction (oak, walnut, or cherry)",
      "Large capacity for adult cremains",
      "Brass QR code memorial plaque",
      "Elegant tribute keepsake",
    ],
    description:
      "Premium wooden cremation urn with integrated QR code plaque. Beautiful, dignified memorial that connects to a full digital tribute honoring your loved one's life and legacy.",
  },
  {
    id: "pet-collar-memorial-tag",
    name: "Pet Memorial Collar with QR Code Tag",
    price: 19.99,
    monthlyFee: 4.99,
    rating: 4.8,
    reviews: 421,
    image: "/images/pet-collar-memorial.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "Durable nylon or leather collar",
      "Stainless steel QR code tag",
      "Adjustable sizing for all breeds",
      "Weather-resistant QR memorial",
    ],
    description:
      "Keep your pet's memory close with this memorial collar featuring a durable QR code tag. Perfect for displaying on a photo or shadow box as a lasting tribute to your beloved companion.",
  },
  {
    id: "pet-garden-tombstone",
    name: "Pet Memorial Garden Stone with QR Code",
    price: 44.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 287,
    image: "/images/pet-tombstone-garden.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "Durable resin or composite stone",
      "Weather-proof outdoor display",
      "Brass QR code memorial plaque",
      "Garden or grave site marker",
    ],
    description:
      "Beautiful outdoor pet memorial stone perfect for gardens or grave sites. Features a permanent brass QR code plaque that links to your pet's digital memorial tribute.",
  },
  {
    id: "pet-cremation-urn-wood",
    name: "Wooden Pet Cremation Urn with QR Code",
    price: 34.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 534,
    image: "/images/pet-cremation-urn-wood.jpg",
    badge: "Best Seller",
    category: "Pet",
    features: [
      "Natural wood with paw print design",
      "Laser-engraved QR code memorial",
      "Multiple sizes for all pets",
      "Beautiful tribute keepsake",
    ],
    description:
      "Elegant wooden pet cremation urn featuring a laser-engraved paw print and QR code. Available in multiple sizes to honor pets of all sizes with dignity and love.",
  },
  {
    id: "pet-cremation-urn-ceramic",
    name: "Ceramic Pet Cremation Urn with QR Memorial",
    price: 39.99,
    monthlyFee: 4.99,
    rating: 4.8,
    reviews: 198,
    image: "/images/pet-urn-ceramic.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "High-quality ceramic construction",
      "Paw print and QR code design",
      "Multiple color options",
      "Elegant memorial display",
    ],
    description:
      "Beautiful ceramic pet urn with integrated paw print and QR code design. Modern, minimalist tribute that connects to your pet's full digital memorial story.",
  },
  {
    id: "pet-photo-frame-qr",
    name: "Pet Memorial Photo Frame with QR Code",
    price: 29.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 412,
    image: "/images/pet-frame-dog-photo.jpg",
    badge: "Pet",
    category: "Pet",
    features: [
      "Displays favorite pet photo (5x7 or 4x6)",
      "QR code plaque at bottom",
      "Desktop or wall mount options",
      "Personalized with pet's name",
    ],
    description:
      "Cherish your pet's memory with this beautiful photo frame featuring an integrated QR code plaque. Display their photo while providing access to their complete digital memorial tribute.",
  },
  {
    id: "custom-pet-portrait-drawing",
    name: "Custom Pet Portrait Drawing with QR Code",
    price: 54.99,
    monthlyFee: 4.99,
    rating: 5.0,
    reviews: 167,
    image: "/images/custom-dog-portrait-drawing.jpg",
    badge: "Premium",
    category: "Pet",
    features: [
      "Custom illustrated pet portrait from photo",
      "Pet name and dates included",
      "QR code at bottom center",
      "High-quality digital print (11x14)",
    ],
    description:
      "Beautiful custom illustrated portrait of your beloved pet featuring their name, special dates, and QR code memorial at the bottom. A unique, artistic tribute to honor their memory.",
  },
  {
    id: "pet-shadow-box-collar",
    name: "Pet Memorial Shadow Box with Collar Display",
    price: 64.99,
    monthlyFee: 4.99,
    rating: 4.9,
    reviews: 203,
    image: "/images/pet-shadow-box-collar.jpg",
    badge: "Premium",
    category: "Pet",
    features: [
      "3D shadow box frame (8x10)",
      "Space for collar, tags, and photo",
      "Laser-engraved QR code plaque",
      "Wall-mount display case",
    ],
    description:
      "Preserve your pet's memory in this elegant 3D shadow box that holds their collar, tags, and favorite photo. Features an engraved QR code plaque connecting to their digital memorial.",
  },
]

export default function StorePage() {
  const humanProducts = products.filter((p) => p.category === "Human")
  const petProducts = products.filter((p) => p.category === "Pet")

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-blue-50 border-b border-blue-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-900">How Pricing Works</h2>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            Each product includes a <span className="font-semibold">one-time purchase price</span> plus{" "}
            <span className="font-semibold">$4.99/month per memorial</span> for unlimited hosting, photos, and videos.{" "}
            <span className="font-semibold">Ordering multiple products for the same memorial?</span> You only pay{" "}
            <span className="font-semibold">one monthly fee</span>.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Memorial QR Code Products - Calgary Northeast
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Beautiful memorial products that connect to personalized digital tributes. Available for Calgary Northeast,
            Airdrie & Chestermere delivery.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Human Memorial Products</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {humanProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
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
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>

                  <ul className="space-y-1.5 mb-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)} CAD</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
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

      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Pet Memorial Products Calgary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {petProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-purple-500 text-white">{product.badge}</Badge>
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
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>

                  <ul className="space-y-1.5 mb-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)} CAD</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
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
    </div>
  )
}
