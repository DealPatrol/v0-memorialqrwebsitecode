"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Star, ShoppingCart, Heart, Shield, Truck, Plus, Minus, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/cart-store"

interface Product {
  id: string
  name: string
  category: string
  material: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  images: string[]
  description: string
  features: string[]
  specifications: {
    [key: string]: string
  }
  sizes: { name: string; price: number; popular: boolean; description: string }[]
  colors: { name: string; hex: string; available: boolean; description: string }[]
  engraving: {
    included: string
    additional: string
  }
  shipping: {
    free: boolean
    time: string
    expedited: string
  }
  testimonials: {
    name: string
    rating: number
    text: string
    location: string
    verified: boolean
  }[]
}

// Placeholder for the getProduct function from the original file
// In a real application, this would likely be fetched from an API
const getProduct = (id: string): Product | null => {
  if (id !== "memorial-qr-plaque") return null

  return {
    id: "memorial-qr-plaque",
    name: "Memorial QR Plaque",
    category: "memorial",
    material: "Premium Aluminum",
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviews: 247,
    images: [
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Main",
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Side",
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Back",
      "/placeholder.svg?height=500&width=500&text=Memorial+QR+Detail",
    ],
    description:
      "Honor your loved one with our beautiful Memorial QR Plaque. This weather-resistant aluminum plaque features a custom QR code that links to a digital memorial page where family and friends can share memories, photos, and stories forever.",
    features: [
      "Weather Resistant Premium Aluminum Construction",
      "Lifetime Digital Memorial Page Included",
      "Custom QR Code Laser Engraved",
      "Professional Text Engraving (up to 6 lines)",
      "Easy Wall or Ground Mounting Hardware",
      "5 Year Fade & Weather Guarantee",
      "Free Shipping & Professional Setup",
      "24/7 Memorial Support & Maintenance",
    ],
    specifications: {
      Material: "Premium Aluminum with Powder Coating",
      Finish: "Weather-Resistant Powder Coat",
      Mounting: "Wall or Ground Mount (hardware included)",
      "QR Code": "Laser Engraved for Permanence",
      Warranty: "5 Years Against Fading & Weather Damage",
      "Production Time": "3-5 Business Days",
      "Digital Memorial": "Lifetime Hosting Included",
      Support: "24/7 Customer Support",
    },
    sizes: [
      { name: "6x4 inches", price: 149, popular: false, description: "Perfect for intimate settings" },
      { name: "8x6 inches", price: 179, popular: true, description: "Most popular size" },
      { name: "10x8 inches", price: 209, popular: false, description: "Great for outdoor display" },
      { name: "12x10 inches", price: 249, popular: false, description: "Premium large format" },
    ],
    colors: [
      { name: "Classic Black", hex: "#1a1a1a", available: true, description: "Timeless and elegant" },
      { name: "Elegant Silver", hex: "#c0c0c0", available: true, description: "Modern and sophisticated" },
      { name: "Antique Bronze", hex: "#cd7f32", available: true, description: "Warm and traditional" },
      { name: "Pearl White", hex: "#f8f8ff", available: true, description: "Pure and peaceful" },
    ],
    engraving: {
      included: "Professional text engraving (up to 6 lines)",
      additional: "Custom artwork and photos available for $25",
    },
    shipping: {
      free: true,
      time: "5-7 business days",
      expedited: "2-3 business days (+$25)",
    },
    testimonials: [],
  }
}

export default function ProductPageClient({ product }: { product: Product | null }) {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/products">View Our Memorial Plaque</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedSizeData = product.sizes.find((size) => size.name === selectedSize)
  const currentPrice = selectedSizeData ? selectedSizeData.price : product.price
  const savings = product.originalPrice - currentPrice

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select a size and color before adding to cart.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    // Simulate adding to cart
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add to cart store
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: currentPrice,
        originalPrice: product.originalPrice,
        size: selectedSize,
        color: selectedColor,
        digitalMemorialIncluded: true,
      })
    }

    toast({
      title: "Added to Cart! 🛒",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    })

    setIsAddingToCart(false)
  }

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select a size and color before purchasing.",
        variant: "destructive",
      })
      return
    }

    // Add to cart and redirect to checkout
    await handleAddToCart()
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-purple-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-purple-600">
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-900">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-lg">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600">Most Popular</Badge>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === index ? "border-purple-600" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
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
                    <span className="text-sm text-slate-600">({product.reviews} reviews)</span>
                  </div>

                  <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-purple-600">${currentPrice}</span>
                    {savings > 0 && (
                      <>
                        <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Save ${savings}</Badge>
                      </>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Size Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Size</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`p-3 border rounded-lg text-left transition-colors relative ${
                          selectedSize === size.name
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{size.name}</span>
                            <p className="text-sm text-slate-600">{size.description}</p>
                          </div>
                          <span className="text-purple-600 font-semibold">${size.price}</span>
                        </div>
                        {size.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600 text-xs">
                            Popular
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Color</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        disabled={!color.available}
                        className={`p-3 border rounded-lg text-left transition-colors flex items-center gap-3 ${
                          selectedColor === color.name
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${!color.available ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <div className="font-medium">{color.name}</div>
                          <div className="text-sm text-slate-600">{color.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
                  >
                    Buy Now - ${(currentPrice * quantity).toFixed(2)}
                  </Button>

                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="lg"
                    className="w-full text-lg py-6 bg-transparent"
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <Button variant="ghost" size="lg" className="w-full text-lg py-6">
                    <Heart className="w-5 h-5 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">5 Year Guarantee</p>
                  </div>
                  <div className="text-center">
                    <Truck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <Check className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium">{key}:</span>
                          <span className="text-slate-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Standard Shipping</h4>
                      <p className="text-slate-600">
                        {product.shipping.free ? "Free shipping" : "Shipping charges apply"} - Delivery in{" "}
                        {product.shipping.time}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Expedited Shipping</h4>
                      <p className="text-slate-600">{product.shipping.expedited} - Additional charges may apply</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Production Time</h4>
                      <p className="text-slate-600">{product.specifications["Production Time"]} before shipping</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.testimonials.length > 0 ? (
                      <div className="space-y-6">
                        {product.testimonials.map((testimonial, index) => (
                          <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              {testimonial.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-600 mb-3 italic">"{testimonial.text}"</p>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-slate-500">{testimonial.location}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 mb-8">
                        <p className="text-slate-600">No reviews yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

function Label({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
      {...props}
    >
      {children}
    </label>
  )
}
