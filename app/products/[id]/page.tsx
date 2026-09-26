import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Check, Heart, Package, QrCode, ShoppingCart } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { STORE_PRODUCTS_BY_ID, isStoreProductId } from "@/lib/store-products"

// Ad-traffic product landing pages. Every statement here must stay true to
// lib/store-products.ts, /pricing and /faq. Do not add durability, lifetime,
// warranty or shipping-time claims until they are confirmed.

const HEADLINES: Partial<Record<string, { headline: string; subhead: string }>> = {
  "slate-plaque": {
    headline: "A slate plaque that opens their full story",
    subhead:
      "A personalized slate desk plaque with a QR code. One scan opens their online memorial with photos, stories, and memories.",
  },
  "voice-keychain": {
    headline: "Keep their voice one scan away",
    subhead: "An acrylic QR keychain that opens a memorial page with their voice recording featured first.",
  },
  "pet-tag": {
    headline: "A QR tag that opens your pet's memorial",
    subhead: "A personalized pet tag with a QR code linked to an online memorial for your companion.",
  },
}

const INDOOR_ONLY = new Set(["slate-plaque", "photo-block", "keep-card"])

export function generateStaticParams() {
  return Object.keys(STORE_PRODUCTS_BY_ID).map((id) => ({ id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  if (!isStoreProductId(params.id)) return { title: "Memorial QR Products" }
  const product = STORE_PRODUCTS_BY_ID[params.id]
  const copy = HEADLINES[product.id]
  return {
    title: `${product.name} | Memorial QR`,
    description: copy?.subhead ?? product.description,
    alternates: { canonical: `/products/${product.id}` },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  if (!isStoreProductId(params.id)) redirect("/store")
  const product = STORE_PRODUCTS_BY_ID[params.id]
  const copy = HEADLINES[product.id] ?? { headline: product.name, subhead: product.description }
  const checkoutHref = `/checkout/simple?product=${product.id}`
  const indoor = INDOOR_ONLY.has(product.id)

  const faqs = [
    {
      q: "Is hosting included in the price?",
      a: `No. The ${product.name} is a one-time purchase of $${product.price.toFixed(2)} CAD. Keeping the online memorial page hosted is a separate $${product.monthlyFee.toFixed(2)}/month per memorial, starting the month after your order. If you order several keepsakes for the same person, you pay one hosting fee, not one per item.`,
    },
    {
      q: "What happens if I stop the hosting plan?",
      a: "You won't be charged for another billing period, and the keepsake is still yours. The hosted memorial page may become unavailable after the paid period ends. Contact us before canceling if you'd like help keeping a copy of the content.",
    },
    {
      q: "Does anyone need an app to scan it?",
      a: "No. Family and friends can scan the QR code with a regular smartphone camera.",
    },
    {
      q: "When do I add photos and stories?",
      a: "Right after checkout you'll be guided to set up the memorial page. You and family members you invite can keep adding photos, stories, and memories later.",
    },
    {
      q: "Who makes it?",
      a: `Each ${product.name} is made to order from a custom print file for one memorial and fulfilled by ${product.provider}.`,
    },
    {
      q: "What currency are prices in?",
      a: "Prices are shown and charged in Canadian dollars (CAD) through Square checkout.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        {/* Hero: headline, what it is, price + hosting terms, one CTA */}
        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-100">
              <QrCode className="h-28 w-28 text-blue-700" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">{product.name}</p>
              <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">{copy.headline}</h1>
              <p className="mb-6 text-lg text-slate-600">{copy.subhead}</p>

              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                <span className="text-slate-600">CAD, one-time</span>
              </div>
              <p className="mb-6 text-sm text-slate-700">
                + ${product.monthlyFee.toFixed(2)}/month per memorial to keep the online memorial page hosted. One
                fee per memorial, not per product. Stop future renewals at any time.
              </p>

              <Button asChild size="lg" className="w-full gap-2 bg-blue-600 py-6 text-lg hover:bg-blue-700 sm:w-auto sm:px-10">
                <Link href={checkoutHref}>
                  <ShoppingCart className="h-5 w-5" /> Order This Keepsake
                </Link>
              </Button>
              {indoor && (
                <p className="mt-4 text-sm text-slate-600">
                  Made for indoor display. This is not an outdoor or headstone marker.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="bg-white px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">What you get</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-slate-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /> {feature}
                </li>
              ))}
              <li className="flex items-start gap-2 text-slate-700">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /> An online memorial page family and friends
                can add photos, stories, and memories to
              </li>
            </ul>
          </div>
        </section>

        {/* How it works in 3 steps */}
        <section className="px-4 py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">How it works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: ShoppingCart, title: "1. Order", text: "Check out securely with Square." },
                {
                  icon: Heart,
                  title: "2. Create their memorial",
                  text: "Right after checkout, add photos, stories, and memories. Invite family to help.",
                },
                {
                  icon: Package,
                  title: "3. Scan to remember",
                  text: `Your keepsake is made to order with its unique QR code and fulfilled by ${product.provider}. Anyone can scan it with a phone camera.`,
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <Icon className="mb-3 h-7 w-7 text-blue-700" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-4 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">Questions families ask</h2>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group p-5">
                  <summary className="cursor-pointer list-none font-semibold text-slate-900">{q}</summary>
                  <p className="mt-3 text-slate-600">{a}</p>
                </details>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">
              More answers on the <Link href="/faq" className="underline">FAQ</Link> and{" "}
              <Link href="/pricing" className="underline">pricing</Link> pages.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900">Ready when you are</h2>
          <p className="mb-6 text-slate-600">
            ${product.price.toFixed(2)} CAD one-time + ${product.monthlyFee.toFixed(2)}/month per memorial for hosting.
          </p>
          <Button asChild size="lg" className="gap-2 bg-blue-600 px-10 py-6 text-lg hover:bg-blue-700">
            <Link href={checkoutHref}>
              <ShoppingCart className="h-5 w-5" /> Order This Keepsake
            </Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
