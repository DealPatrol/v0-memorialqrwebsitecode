"use client"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Check, Info } from "lucide-react"
import { STORE_PRODUCTS } from "@/lib/store-products"

export default function StorePage() {
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
            A print-on-demand keepsake that connects directly to a personalized digital tribute.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Voice Memorial Keychain</h2>
            <p className="text-center text-muted-foreground">Fulfilled as a Printify acrylic keychain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {STORE_PRODUCTS.map((product) => (
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
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="pb-3 flex-1">
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

    </div>
  )
}
