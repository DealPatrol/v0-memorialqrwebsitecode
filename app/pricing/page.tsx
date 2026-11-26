import Link from "next/link"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { PlaqueCostAnswer } from "@/components/plaque-cost-answer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = pageMetadata(publicPages.pricing)

export const dynamic = "force-dynamic"

export default function PricingPage() {
  const keepsakes = getSellableKeepsakes()
  const lowestKeepsake = keepsakes.length ? Math.min(...keepsakes.map((product) => product.price)) : null
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Keepsake Pricing</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A QR keepsake is a one-time purchase. It includes {HOSTING_INCLUDED_YEARS} years of hosting for the
            memorial page it opens. There is no subscription.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Digital Memorial Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <span className="text-4xl font-bold text-foreground">{formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}</span>
              <span className="text-muted-foreground"> one time</span>
            </div>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-foreground" />
                Online memorial page and a QR code you can print or share
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-foreground" />
                {HOSTING_INCLUDED_YEARS} years of hosting, starting on the order date
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-foreground" />
                Nothing is shipped. No flowers, urns, or jewelry.
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href={DIGITAL_MEMORIAL_PATH}>Order a Digital Memorial</Link>
            </Button>
          </CardContent>
        </Card>

        <PlaqueCostAnswer className="mb-8 rounded-xl border bg-card px-6 py-8" pagePath="/pricing" />

        <Card>
          <CardHeader>
            <CardTitle>QR Memorial Keepsake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {lowestKeepsake !== null ? (
              <div>
                <span className="text-muted-foreground">From </span>
                <span className="text-4xl font-bold text-foreground">{formatUsd(lowestKeepsake)}</span>
                <span className="text-muted-foreground"> one time</span>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Printed keepsakes are not available to order online right now. Metal plaques stay on the waitlist.
              </p>
            )}
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-foreground" />
                {HOSTING_INCLUDED_YEARS} years of memorial page hosting, starting on the order date
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-foreground" />
                Photos, videos, and stories on one page, opened by the QR code on the keepsake
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-foreground" />
                One payment. No recurring charges.
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/store">See Keepsakes</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/faq">Read the FAQ</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
