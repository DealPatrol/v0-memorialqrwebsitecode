import Link from "next/link"
import { HOSTING_MONTHLY_PRICE } from "@/lib/pricing"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { getSellablePodProducts, memorialStartHref } from "@/lib/fulfillment-availability"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = pageMetadata(publicPages.pricing)

export const dynamic = "force-dynamic"

export default function PricingPage() {
  const keepsakes = getSellablePodProducts()
  const lowestKeepsake = keepsakes.length ? Math.min(...keepsakes.map((product) => product.price)) : null
  const startHref = memorialStartHref()
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Memorial Page Hosting</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {lowestKeepsake === null
              ? "The memorial page stays online for one monthly hosting fee. Nothing is shipped."
              : `A memorial page on its own is billed monthly. A printed keepsake is a one-time purchase that includes ${HOSTING_INCLUDED_YEARS} years of hosting.`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Digital Memorial Hosting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <span className="text-4xl font-bold text-slate-900">{formatUsd(HOSTING_MONTHLY_PRICE)}</span>
              <span className="text-slate-600"> per month, per memorial</span>
            </div>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                Photos, videos, and stories on one page
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                One hosting fee for each memorial you keep online
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href={startHref}>Create a Memorial Page</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/faq">Read Hosting FAQ</Link>
            </Button>
          </CardContent>
        </Card>

        {lowestKeepsake !== null && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Printed QR Keepsake</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <span className="text-slate-600">From </span>
                <span className="text-4xl font-bold text-slate-900">{formatUsd(lowestKeepsake)}</span>
                <span className="text-slate-600"> one time, US shipping included</span>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  {HOSTING_INCLUDED_YEARS} years of basic hosting for the memorial page, starting on the order date
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  No monthly fee during those {HOSTING_INCLUDED_YEARS} years; renewal is optional after that
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  Several keepsakes for the same memorial share one hosting term
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/store">See Keepsakes</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
