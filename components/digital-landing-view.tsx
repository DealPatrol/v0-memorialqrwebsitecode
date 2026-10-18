import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { SisterShopNote } from "@/components/sister-shop-note"
import { TrackViewContent } from "@/components/track-view-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import {
  DIGITAL_MEMORIAL_CHECKOUT_PATH,
  DIGITAL_MEMORIAL_PATH,
} from "@/lib/digital-memorial"
import { digitalLandingJsonLd, digitalLandingList, type DigitalLandingPage } from "@/lib/digital-landing"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { KEEPSAKE_COLLECTION_PATH } from "@/lib/keepsake-collection"
import { formatUsd } from "@/lib/site"

export function DigitalLandingView({ page }: { page: DigitalLandingPage }) {
  const related = digitalLandingList.filter((item) => item.path !== page.path)
  const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={digitalLandingJsonLd(page)} />
      <TrackViewContent
        contentId={DIGITAL_MEMORIAL_PRODUCT.id}
        contentName={DIGITAL_MEMORIAL_PRODUCT.name}
        value={DIGITAL_MEMORIAL_PRODUCT.price}
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: KEEPSAKE_COLLECTION_PATH, label: "Keepsakes you can order" },
            { href: page.path, label: page.h1 },
          ]}
        />
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">{page.h1}</h1>
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">How it works</h2>
              <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                {page.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="text-muted-foreground">
                The price is {price} once. Nothing is shipped. Hosting for {HOSTING_INCLUDED_YEARS} years is included.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Questions before you order</h2>
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </section>
            {page.id === "pet" ? <SisterShopNote layout="inline" /> : null}
            <nav aria-label="Related digital memorial pages" className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Other ways to order the page</h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} className="underline">
                      {item.h1}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={DIGITAL_MEMORIAL_PATH} className="underline">
                    Digital memorial page details
                  </Link>
                </li>
                <li>
                  <Link href={KEEPSAKE_COLLECTION_PATH} className="underline">
                    Keepsakes you can order
                  </Link>
                </li>
              </ul>
            </nav>
          </article>
          <Card id="order" className="scroll-mt-24">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold">{DIGITAL_MEMORIAL_PRODUCT.name}</h2>
              <p className="text-3xl font-bold">{price}</p>
              <p className="text-sm text-muted-foreground">
                One-time payment. Nothing is shipped. {HOSTING_INCLUDED_YEARS} years of hosting included. No monthly
                fee.
              </p>
              <Button asChild className="w-full" size="lg">
                <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Buy the digital memorial</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                <Link href={DIGITAL_MEMORIAL_PATH} className="underline">
                  See what is included
                </Link>{" "}
                before you pay. You add the photos and stories yourself.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{DIGITAL_MEMORIAL_PRODUCT.name}</p>
              <p className="text-sm text-muted-foreground">{price} once. Nothing is shipped.</p>
            </div>
            <Button asChild size="sm">
              <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Buy</Link>
            </Button>
          </div>
        </div>
        <div className="h-20 lg:hidden" aria-hidden="true" />
      </main>
    </div>
  )
}
