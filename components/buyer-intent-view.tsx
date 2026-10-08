import Link from "next/link"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { KeepsakePurchaseDetails } from "@/components/keepsake-purchase-details"
import { MemorialGuideSection } from "@/components/memorial-guide-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  buyerIntentJsonLd,
  buyerIntentList,
  PRIMARY_KEEPSAKE_ID,
  type BuyerIntent,
} from "@/lib/buyer-intent"
import { getSellableKeepsake, getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { CONCIERGE_PRICE_LABEL } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

export function BuyerIntentView({
  page,
  related = buyerIntentList.filter((item) => item.id !== page.id),
  relatedHeading = "Other ways families remember",
}: {
  page: BuyerIntent
  related?: BuyerIntent[]
  relatedHeading?: string
}) {
  const product = getSellableKeepsake(PRIMARY_KEEPSAKE_ID)
  const others = getSellableKeepsakes().filter((item) => item.id !== PRIMARY_KEEPSAKE_ID)
  const linksSympathy = related.every((item) => item.path !== "/sympathy-gift-ideas") && page.path !== "/sympathy-gift-ideas"

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      {product ? <JsonLd data={buyerIntentJsonLd(page, product)} /> : null}
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/store" className="underline">
            QR Memorial Keepsakes
          </Link>
        </p>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">{page.h1}</h1>
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Questions families ask</h2>
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </section>
            <nav aria-label="Related memorial pages" className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">{relatedHeading}</h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path} className="underline">
                      {item.h1}
                    </Link>
                  </li>
                ))}
                {linksSympathy ? (
                  <li>
                    <Link href="/sympathy-gift-ideas" className="underline">
                      Sympathy gift ideas
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link href="/funeral-homes" className="underline">
                    For funeral homes
                  </Link>
                </li>
                {page.showGuide ? null : (
                  <li>
                    <Link href="/#memorial-guide" className="underline">
                      Free guide: how to create a meaningful memorial page
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            {page.showGuide ? <MemorialGuideSection /> : null}
          </article>
          <Card>
            <CardContent className="space-y-4 p-6">
              {product ? (
                <>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <KeepsakePurchaseDetails product={product} />
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/store">See keepsakes</Link>
                </Button>
              )}
              {page.showConcierge ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/concierge">Have us build the page ({CONCIERGE_PRICE_LABEL})</Link>
                </Button>
              ) : null}
              {others.length > 0 ? (
                <div className="space-y-2 border-t pt-4">
                  <h3 className="text-sm font-semibold">Other keepsakes you can order</h3>
                  <ul className="space-y-2">
                    {others.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                        <Link href={`/store/${item.id}`} className="underline">
                          {item.name}
                        </Link>
                        <span>{formatUsd(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
