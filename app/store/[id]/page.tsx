import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { KeepsakePurchaseDetails } from "@/components/keepsake-purchase-details"
import { Card, CardContent } from "@/components/ui/card"
import { buyerIntentList } from "@/lib/buyer-intent"
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
  const description = clip(
    `${product.name} is ${formatUsd(product.price)} once. Shipping is included, with ${HOSTING_INCLUDED_YEARS} years of hosting. Ships in the United States.`,
    155,
  )
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
              <p className="text-muted-foreground">{product.description}</p>
              <KeepsakePurchaseDetails product={product} />
              <nav aria-label="Ways to use this keepsake" className="space-y-2 border-t pt-4">
                <h2 className="text-sm font-semibold">Ways families use it</h2>
                <ul className="space-y-1 text-sm">
                  {buyerIntentList.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path} className="underline">
                        {item.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
