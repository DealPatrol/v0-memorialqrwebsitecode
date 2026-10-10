import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
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
import { getListedKeepsake, getListedKeepsakes } from "@/lib/fulfillment-availability"
import { giftIntentList } from "@/lib/gift-intent"
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
  const product = getListedKeepsake(page.keepsakeId ?? PRIMARY_KEEPSAKE_ID)
  const others = getListedKeepsakes().filter((item) => item.id !== product?.id)
  const linksSympathy = related.every((item) => item.path !== "/sympathy-gift-ideas") && page.path !== "/sympathy-gift-ideas"
  const section = giftIntentList.some((item) => item.path === page.path)
    ? { href: "/gifts", label: "Gifts" }
    : { href: "/guides", label: "Guides" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      {product ? <JsonLd data={buyerIntentJsonLd(page, product)} /> : null}
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            section,
            { href: page.path, label: page.h1 },
          ]}
        />
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">{page.h1}</h1>
            {product && !product.available ? (
              <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                The {product.name} is coming soon. We are not taking orders yet.{" "}
                <a href="#waitlist" className="font-medium underline">
                  Join the list
                </a>{" "}
                and we will email you once when it can be ordered.
              </p>
            ) : null}
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
                {(page.links ?? []).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/guides" className="underline">
                    All memorial guides
                  </Link>
                </li>
                <li>
                  <Link href="/gifts" className="underline">
                    Memorial gift ideas
                  </Link>
                </li>
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
          <Card id="order" className="scroll-mt-24">
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
                  <h3 className="text-sm font-semibold">Other keepsakes</h3>
                  <ul className="space-y-2">
                    {others.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                        <Link href={`/store/${item.id}`} className="underline">
                          {item.name}
                        </Link>
                        <span>{item.available ? formatUsd(item.price) : "Coming soon"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
        {product ? (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.available ? `$${product.price.toFixed(2)} once. Hosting included.` : "Coming soon. Join the list."}
                </p>
              </div>
              <Button asChild size="sm">
                <a href={product.available ? "#order" : "#waitlist"}>{product.available ? "Order" : "Join the list"}</a>
              </Button>
            </div>
          </div>
        ) : null}
        <div className="h-20 lg:hidden" aria-hidden="true" />
      </main>
    </div>
  )
}
