"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Star, ShoppingCart, Heart, Search, Check, Shield, Truck } from "lucide-react"

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
  testimonials: [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Beautiful memorial for my father. The QR code makes it so easy for family to share memories.",
      location: "California",
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "High quality craftsmanship. The digital memorial page is perfect for our family.",
      location: "Texas",
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      text: "Exceeded our expectations. The customer service was exceptional throughout.",
      location: "Florida",
    },
  ],
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const savings = product.originalPrice - product.price

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/30">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-muted to-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-lg">
              🏆 #1 Memorial Solution
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Memorial QR Plaque</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The perfect way to honor your loved ones with a beautiful physical memorial that connects to a digital
              legacy page
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search memorial options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
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
                      <Badge className="absolute top-4 left-4 bg-accent hover:bg-accent/90 text-accent-foreground">
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
                            i < Math.floor(product.rating) ? "fill-chart-1 text-chart-1" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  <h2 className="text-3xl font-bold text-foreground mb-4">{product.name}</h2>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-primary">${product.price}</span>
                    {savings > 0 && (
                      <>
                        <span className="text-2xl text-muted-foreground line-through">${product.originalPrice}</span>
                        <Badge className="bg-chart-2/20 text-chart-2 hover:bg-chart-2/20">Save ${savings}</Badge>
                      </>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Available Sizes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {product.sizes.map((size, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {size}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Color Options:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {product.colors.map((color, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <Button asChild size="lg" className="flex-1 bg-primary hover:bg-primary/90">
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
                      <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-semibold">5 Year Guarantee</p>
                    </div>
                    <div className="text-center">
                      <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-semibold">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <Check className="w-6 h-6 text-primary mx-auto mb-2" />
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What's Included</h2>
              <p className="text-muted-foreground">Everything you need for a complete memorial solution</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted">
                  <Check className="w-6 h-6 text-chart-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-muted to-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What Families Are Saying</h2>
              <p className="text-muted-foreground">Real testimonials from families who chose our memorial solution</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {product.testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-chart-1 text-chart-1" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Ready to Honor Your Loved One?</h2>
            <p className="text-xl mb-8 opacity-90">
              Create a lasting memorial that connects the physical and digital worlds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                <Link href={`/products/${product.id}`}>Order Your Memorial Plaque</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                <Link href="/contact">Speak with a Memorial Specialist</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-muted-foreground text-sm">
                Honoring memories with digital memorials that last forever.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
              <ul className="space-y-2 text-sm text-muted-foreground">
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
              <ul className="space-y-2 text-sm text-muted-foreground">
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

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
