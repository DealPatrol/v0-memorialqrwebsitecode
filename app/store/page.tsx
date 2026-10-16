import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { DigitalMemorialOfferCard } from "@/components/digital-memorial-offer-card"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { buyerIntentList } from "@/lib/buyer-intent"
import { getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { KEEPSAKE_COLLECTION_PATH } from "@/lib/keepsake-collection"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { SUPPORT_EMAIL } from "@/lib/site"

export const metadata = pageMetadata(publicPages.store)

export const dynamic = "force-dynamic"

export default function StorePage() {
  const physicalProducts = getSellableKeepsakes()
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      <section className="px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">QR Memorial Keepsakes</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Each keepsake carries a QR code that opens an online memorial page of photos, stories, and messages. Every
            keepsake includes {HOSTING_INCLUDED_YEARS} years of hosting for its memorial page. One payment, no recurring
            fees.{" "}
            <Link href={KEEPSAKE_COLLECTION_PATH} className="underline">
              Keepsakes you can order
            </Link>{" "}
            leaves out plaques that are not for sale yet.
          </p>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DigitalMemorialOfferCard />
        </div>
      </section>

      <SellableProductGrid />

      <section className="pb-12 px-4">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>What every keepsake includes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>A unique QR code printed on the keepsake</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>A memorial page for photos, videos, and the life story</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{HOSTING_INCLUDED_YEARS} years of hosting included, starting on the order date</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Family members can add their own memories</span>
                </li>
              </ul>
              {physicalProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Printed keepsakes are not available to order online right now. The digital memorial page is, and
                  nothing is shipped. Email{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                    {SUPPORT_EMAIL}
                  </a>{" "}
                  if you need help with an order.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/concierge">Have us build the memorial page</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-4">
        <nav aria-label="Keepsake guides" className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-lg font-semibold">Find the keepsake you need</h2>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {buyerIntentList.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="underline">
                  {item.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/funeral-homes" className="underline">
                Funeral homes
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  )
}
