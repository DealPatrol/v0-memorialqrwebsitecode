"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Star, ShoppingCart, Heart, Search, Check, Shield, Truck, Clock } from "lucide-react"

const product = {
  id: "memorial-qr-plaque",
  name: "Memorial QR Plaque",
  category: "memorial",
  material: "Premium Aluminum",
  price: 149,
  originalPrice: 199,
  rating: 4.9,
  reviews: 247,
  image: "/placeholder.svg?height=400&width=400&text=Memorial+QR+Plaque",
  badge: "Most Popular",
  description:
    "Honor your loved one with our beautiful Memorial QR Plaque. This weather-resistant aluminum plaque features a custom QR code that links to a digital memorial page where family and friends can share memories, photos, and stories forever.",
  features: [
    "Weather Resistant Aluminum Construction",
    "Lifetime Digital Memorial Included",
    "Custom QR Code Laser Engraved",
    "Professional Text Engraving",
    "Easy Wall or Ground Mounting",
    "5 Year Fade Guarantee",
    "Free Shipping & Setup",
    "24/7 Memorial Support",
  ],
  sizes: ["6x4 inches", "8x6 inches", "10x8 inches", "12x10 inches"],
  colors: ["Classic Black", "Elegant Silver", "Antique Bronze", "Pearl White"],
}

export function ProductsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const savings = product.originalPrice - product.price

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-100 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-lg">
              🏆 #1 Memorial Solution
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Memorial QR Plaque</h1>
            <p className="text-xl text-slate-600 mb-8">
              The perfect way to honor your loved ones with a beautiful physical memorial that connects to a digital
              legacy page
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search memorial options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href={`/products/${product.id}`}>View Details & Order</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/browse-memorials">See Sample Memorials</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-xl">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square lg:aspect-auto lg:h-full relative overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    {product.badge && (
                      <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white">
                        {product.badge}
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4">
                      <Button variant="secondary" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-8 lg:p-12">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-600">({product.reviews} reviews)</span>
                  </div>

                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h2>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-purple-600">${product.price}</span>
                    {savings > 0 && (
                      <>
                        <span className="text-2xl text-slate-500 line-through">${product.originalPrice}</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Save ${savings}</Badge>
                      </>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Available Sizes:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {product.sizes.map((size, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                            {size}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Color Options:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {product.colors.map((color, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                            {color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <Button asChild size="lg" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Link href={`/products/${product.id}`}>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Order Now
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                    <div className="text-center">
                      <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold">5 Year Guarantee</p>
                    </div>
                    <div className="text-center">
                      <Truck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <Check className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold">Quality Guaranteed</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Included</h2>
              <p className="text-slate-600">Everything you need for a complete memorial solution</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                  <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Guarantee Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Promise to You</h2>
              <p className="text-slate-600">We stand behind every memorial we create</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Quality Guarantee</h3>
                <p className="text-slate-600 text-sm">
                  If you're not satisfied, we'll make it right or refund your purchase.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Lifetime Hosting</h3>
                <p className="text-slate-600 text-sm">Your digital memorial stays online forever. No hidden fees.</p>
              </Card>
              <Card className="p-6 text-center">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Personal Support</h3>
                <p className="text-slate-600 text-sm">Real people here to help you create the perfect memorial.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Honor Your Loved One?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Create a lasting memorial that connects the physical and digital worlds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href={`/products/${product.id}`}>Order Your Memorial Plaque</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
              >
                <Link href="/contact">Speak with a Memorial Specialist</Link>
              </Button>
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
                  <Link href="/products" className="hover:text-white">
                    Memorial Plaque
                  </Link>
                </li>
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
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
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
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
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
