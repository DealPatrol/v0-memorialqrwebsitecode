import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { PlaqueWaitlistSection } from "@/components/plaque-waitlist-section"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { Button } from "@/components/ui/button"
import { getListedKeepsakes } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import {
  collectionFaqs,
  CONCIERGE_CHECKOUT_PRODUCT,
  KEEPSAKE_COLLECTION_PATH,
  keepsakeCollectionJsonLd,
  keepsakesForCollection,
} from "@/lib/keepsake-collection"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd, SAMPLE_MEMORIAL_NAME, SAMPLE_MEMORIAL_PATH } from "@/lib/site"

export const metadata = pageMetadata(publicPages.keepsakes)

export const dynamic = "force-dynamic"

export default function KeepsakesForSalePage() {
  const products = keepsakesForCollection()
  const plaques = getListedKeepsakes().filter((product) => !product.available)
  const faqs = collectionFaqs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={keepsakeCollectionJsonLd(products)} />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: KEEPSAKE_COLLECTION_PATH, label: "Keepsakes you can order" },
          ]}
        />
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Keepsakes you can order</h1>
        <p className="mb-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          A sympathy gift you can check out today is one of the keepsakes below. Each one carries a QR code that opens
          a memorial page of photos and stories. You pay once. Shipping to a United States address is included, and the
          page includes {HOSTING_INCLUDED_YEARS} years of hosting.
        </p>
        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Metal plaques are not in this list. They are coming soon, and the waitlist is further down this page. We do
          not sell flowers, urns, or jewelry.
        </p>

        {products.length > 0 ? (
          <SellableProductGrid mode="available" title="Order today" />
        ) : (
          <p className="mb-10 rounded-lg border border-border bg-white p-5 text-muted-foreground">
            No printed keepsake is available to order online right now. This page stays empty until Square checkout
            can charge one. You can join the plaque waitlist, or have us build the memorial page.
          </p>
        )}

        <section className="mx-auto mb-12 max-w-xl rounded-lg border border-border bg-white p-6">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">Have us build the memorial page</h2>
          <p className="mb-4 text-muted-foreground">
            The concierge service is {formatUsd(CONCIERGE_CHECKOUT_PRODUCT.price)}. We build the page and send the
            link. Nothing is shipped.
          </p>
          <Button asChild>
            <Link href="/concierge">Have Us Build It</Link>
          </Button>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Questions before you order</h2>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </section>

        <nav aria-label="Related memorial pages" className="mb-4">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">More ways to remember</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/sympathy-gift-ideas" className="underline">
                Sympathy gift ideas
              </Link>
            </li>
            <li>
              <Link href="/gifts" className="underline">
                Memorial gift ideas
              </Link>
            </li>
            <li>
              <Link href="/store" className="underline">
                Full keepsake list, including plaques that are not for sale yet
              </Link>
            </li>
            {plaques.map((product) => (
              <li key={product.id}>
                <Link href={`/store/${product.id}#waitlist`} className="underline">
                  {product.name} waitlist
                </Link>
              </li>
            ))}
            <li>
              <Link href={SAMPLE_MEMORIAL_PATH} className="underline">
                Sample memorial for {SAMPLE_MEMORIAL_NAME}
              </Link>
            </li>
          </ul>
        </nav>
      </main>
      <PlaqueWaitlistSection />
    </div>
  )
}
