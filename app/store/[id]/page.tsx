import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check } from "lucide-react"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSellableKeepsake } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { keepsakeProductJsonLd } from "@/lib/keepsake-jsonld"
import { assertMetadataLength, pageMetadata } from "@/lib/seo"
import { formatUsd, SITE_NAME } from "@/lib/site"

export const dynamic = "force-dynamic"

function clip(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getSellableKeepsake(params.id)
  const path = `/store/${params.id}`
  if (!product) {
    return pageMetadata({
      title: "Keepsake | MemorialsQR",
      description: "This keepsake is not available to order.",
      path,
      index: false,
    })
  }

  const title = clip(`${product.name} | ${SITE_NAME}`, 60)
  const description = clip(product.description, 155)
  assertMetadataLength(title, description, path)
  return pageMetadata({ title, description, path })
}

export default function KeepsakePage({ params }: { params: { id: string } }) {
  const product = getSellableKeepsake(params.id)
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={keepsakeProductJsonLd(product)} />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/store" className="underline">
            QR Memorial Keepsakes
          </Link>
        </p>
        <div className="grid items-start gap-8 md:grid-cols-2">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={960}
            height={720}
            className="h-auto w-full rounded-xl border bg-white object-contain"
            priority
          />
          <Card>
            <CardContent className="space-y-5 p-6">
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-3xl font-bold">{formatUsd(product.price)}</p>
              <p className="text-muted-foreground">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                One payment of {formatUsd(product.price)}. {HOSTING_INCLUDED_YEARS} years of hosting included. Ships to
                United States addresses.
              </p>
              <Button asChild className="w-full" size="lg">
                <Link href={`/checkout/simple?product=${product.id}`}>Buy</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
