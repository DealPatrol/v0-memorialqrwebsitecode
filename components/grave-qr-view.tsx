import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DigitalMemorialTrust } from "@/components/digital-memorial-trust"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { PlaqueWaitlistForm } from "@/components/plaque-waitlist-form"
import { TrackViewContent } from "@/components/track-view-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { EXAMPLE_MEMORIAL_NAME, EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import {
  GRAVE_QR_CHECKOUT_PATH,
  GRAVE_QR_PLAQUE_ID,
  graveQrJsonLd,
  graveQrList,
  type GraveQrPage,
} from "@/lib/grave-qr-pages"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { KEEPSAKE_COLLECTION_PATH } from "@/lib/keepsake-collection"
import { formatUsd } from "@/lib/site"

export function GraveQrView({ page }: { page: GraveQrPage }) {
  const related = graveQrList.filter((item) => item.path !== page.path)
  const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={graveQrJsonLd(page)} />
      <TrackViewContent
        contentId={DIGITAL_MEMORIAL_PRODUCT.id}
        contentName={DIGITAL_MEMORIAL_PRODUCT.name}
        value={DIGITAL_MEMORIAL_PRODUCT.price}
        landingPath={page.path}
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
            <p className="text-lg leading-relaxed text-muted-foreground">
              <Link href={EXAMPLE_MEMORIAL_PATH} className="underline">
                See an example memorial page
              </Link>{" "}
              before you pay. {EXAMPLE_MEMORIAL_NAME} is not a real person.
            </p>
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
                The metal plaque is coming soon.
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
            <nav aria-label="Related grave and plaque pages" className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Related pages</h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} className="underline">
                      {item.h1}
                    </Link>
                  </li>
                ))}
                {page.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="#waitlist" className="underline">
                    Join the QR Memorial Plaque waitlist
                  </Link>
                </li>
                <li>
                  <Link href={EXAMPLE_MEMORIAL_PATH} className="underline">
                    Example memorial page
                  </Link>
                </li>
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
                <li>
                  <Link href="/concierge" className="underline">
                    Have us build the page
                  </Link>
                </li>
              </ul>
            </nav>
          </article>
          <div className="space-y-4">
            <Card id="order" className="scroll-mt-24">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold">{DIGITAL_MEMORIAL_PRODUCT.name}</h2>
                <p className="text-3xl font-bold">{price}</p>
                <p className="text-sm text-muted-foreground">
                  One-time payment. Nothing is shipped. {HOSTING_INCLUDED_YEARS} years of hosting included. No monthly
                  fee. A metal plaque is not included.
                </p>
                <Button asChild className="w-full" size="lg">
                  <Link href={GRAVE_QR_CHECKOUT_PATH}>Buy the digital memorial</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={EXAMPLE_MEMORIAL_PATH}>See an example page</Link>
                </Button>
                <DigitalMemorialTrust />
                <p className="text-sm text-muted-foreground">
                  <Link href={DIGITAL_MEMORIAL_PATH} className="underline">
                    See what is included
                  </Link>{" "}
                  before you pay. You add the photos and stories yourself.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold">QR Memorial Plaque</h2>
                <p className="text-sm text-muted-foreground">
                  Coming soon. We are not taking plaque orders. Leave your email and we will write once when it can be
                  ordered. Nothing is charged. Joining this list does not buy the digital memorial.
                </p>
                <PlaqueWaitlistForm productId={GRAVE_QR_PLAQUE_ID} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{DIGITAL_MEMORIAL_PRODUCT.name}</p>
              <p className="text-sm text-muted-foreground">{price} once. Nothing is shipped.</p>
            </div>
            <Button asChild size="sm">
              <Link href={GRAVE_QR_CHECKOUT_PATH}>Buy</Link>
            </Button>
          </div>
        </div>
        <div className="h-20 lg:hidden" aria-hidden="true" />
      </main>
    </div>
  )
}
