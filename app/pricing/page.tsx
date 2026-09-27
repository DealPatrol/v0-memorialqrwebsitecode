import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Pricing | Memorial QR",
  description:
    "The Slate Desk Plaque is $49 with 10 years of memorial page hosting included. Other products are one-time purchases plus $4.99 per month per memorial for hosting.",
  alternates: {
    canonical: "/pricing",
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Clear Memorial QR Pricing</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Buy the physical product once, then pay one hosting fee for each digital memorial you keep online.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Physical Memorial Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <span className="text-4xl font-bold text-slate-900">$19.99</span>
                <span className="text-slate-600"> and up, one time</span>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  Seven Printful and Printify products are priced individually in US dollars
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  Your exact product total is shown before Square checkout
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/store">Shop Products</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Digital Memorial Hosting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <span className="text-4xl font-bold text-slate-900">$4.99</span>
                <span className="text-slate-600"> per month, per memorial</span>
              </div>
              <p className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-900">
                Buying the Slate Desk Plaque ($49)? 10 years of memorial page hosting is included, with no monthly fee.
              </p>
              <p className="text-slate-700">
                For other products, hosting is a recurring charge separate from the physical product price. Multiple products can point to
                the same memorial without adding another hosting fee.
              </p>
              <p className="text-sm text-slate-600">
                You can stop future renewals. See the FAQ for what cancellation means for the hosted page.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/faq">Read Hosting FAQ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
