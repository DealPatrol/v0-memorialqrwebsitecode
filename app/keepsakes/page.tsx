import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DigitalMemorialOfferCard } from "@/components/digital-memorial-offer-card"
import { RememberDigitalLanding } from "@/components/remember-digital-landing"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { PlaqueWaitlistSection } from "@/components/plaque-waitlist-section"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { Button } from "@/components/ui/button"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH } from "@/lib/digital-memorial"
import { digitalLandingList } from "@/lib/digital-landing"
import { getListedKeepsakes } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import {
  collectionFaqs,
  CONCIERGE_CHECKOUT_PRODUCT,
  KEEPSAKE_COLLECTION_PATH,
  keepsakeCollectionJsonLd,
  keepsakesForCollection,
} from "@/lib/keepsake-collection"
import { EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"
import { SympathyGiftNav } from "@/components/sympathy-gift-nav"

export const metadata = pageMetadata(publicPages.keepsakes)

export const dynamic = "force-dynamic"

export default function KeepsakesForSalePage() {
  const products = keepsakesForCollection()
  const plaques = getListedKeepsakes().filter((product) => !product.available)
  const faqs = collectionFaqs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={keepsakeCollectionJsonLd(products)} />
      <RememberDigitalLanding pathname={KEEPSAKE_COLLECTION_PATH} />
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
          The digital memorial page is {formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}. You get an online page and a QR
          code you can print or share. You pay once. Nothing is shipped, and the page includes {HOSTING_INCLUDED_YEARS}{" "}
          years of hosting.
        </p>
        <p className="mb-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Metal plaques are not in this list. They are coming soon, and the waitlist is further down this page. We do
          not sell flowers, urns, or jewelry.
          {products.length > 0
            ? " Printed keepsakes below include shipping to a United States address."
            : " No printed keepsake is available to order online right now."}
        </p>
        <div className="mb-10">
          <Button asChild size="lg">
            <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>
              Buy the digital memorial · {formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}
            </Link>
          </Button>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold text-foreground">Order today</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DigitalMemorialOfferCard />
          </div>
        </section>

        {products.length > 0 ? <SellableProductGrid mode="available" title="Printed keepsakes" /> : null}

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

        <nav aria-label="Digital memorial guides" className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">About the digital memorial</h2>
          <ul className="space-y-2">
            {digitalLandingList.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="underline">
                  {item.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SympathyGiftNav
          className="mb-8"
          intro={`Each of these pages leads to the ${formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)} digital memorial. At checkout, mark it as a gift and add the recipient's name, email, and a short note. Nothing is shipped.`}
        />

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
              <Link href={EXAMPLE_MEMORIAL_PATH} className="underline">
                Example memorial page
              </Link>
            </li>
          </ul>
        </nav>
      </main>
      <PlaqueWaitlistSection />
    </div>
  )
}
