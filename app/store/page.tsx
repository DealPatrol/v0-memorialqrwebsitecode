import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { DIGITAL_MEMORIAL } from "@/lib/catalog"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { getSellablePodProducts, memorialStartHref } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { HOSTING_MONTHLY_PRICE } from "@/lib/pricing"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

export const metadata = pageMetadata(publicPages.store)

export const dynamic = "force-dynamic"

export default function StorePage() {
  const physicalProducts = getSellablePodProducts()
  const startHref = memorialStartHref()
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Digital Memorials</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A memorial page for photos, stories, and messages. Hosting is {formatUsd(HOSTING_MONTHLY_PRICE)} per month
            for each memorial.
            {physicalProducts.length === 0
              ? " Nothing is shipped."
              : ` Printed keepsakes ship to United States addresses and include ${HOSTING_INCLUDED_YEARS} years of hosting with no monthly fee.`}
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{DIGITAL_MEMORIAL.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-4xl font-bold text-blue-600">{formatUsd(HOSTING_MONTHLY_PRICE)}</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>A page for photos, videos, and the life story</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Family members can add their own memories</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Hosting keeps the page online for {formatUsd(HOSTING_MONTHLY_PRICE)} per month</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href={startHref}>Create a Memorial Page</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/concierge">Have us build it</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <SellableProductGrid />
    </div>
  )
}
