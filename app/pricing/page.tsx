import Link from "next/link"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = pageMetadata(publicPages.pricing)

export const dynamic = "force-dynamic"

export default function PricingPage() {
  const keepsakes = getSellableKeepsakes()
  const lowestKeepsake = keepsakes.length ? Math.min(...keepsakes.map((product) => product.price)) : null
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Keepsake Pricing</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            A QR keepsake is a one-time purchase. It includes {HOSTING_INCLUDED_YEARS} years of hosting for the
            memorial page it opens. There is no subscription.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QR Memorial Keepsake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {lowestKeepsake !== null && (
              <div>
                <span className="text-slate-600">From </span>
                <span className="text-4xl font-bold text-slate-900">{formatUsd(lowestKeepsake)}</span>
                <span className="text-slate-600"> one time</span>
              </div>
            )}
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                {HOSTING_INCLUDED_YEARS} years of memorial page hosting, starting on the order date
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                Photos, videos, and stories on one page, opened by the QR code on the keepsake
              </li>
              <li className="flex gap-2">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
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
