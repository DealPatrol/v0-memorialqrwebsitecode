import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { TrackViewContent } from "@/components/track-view-content"
import { KeepsakePurchaseDetails } from "@/components/keepsake-purchase-details"
import { ProductReviews } from "@/components/product-reviews"
import { Card, CardContent } from "@/components/ui/card"
import { buyerIntentList } from "@/lib/buyer-intent"
import { relatedHandmadePlaqueId } from "@/lib/catalog"
import { giftIntentList } from "@/lib/gift-intent"
import { getSellableKeepsake, getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { keepsakeFaqJsonLd, keepsakeFaqs } from "@/lib/keepsake-faq"
import { keepsakeProductJsonLd } from "@/lib/keepsake-jsonld"
import { keepsakePageCopy } from "@/lib/keepsake-page"
import { assertMetadataLength, pageMetadata } from "@/lib/seo"

export function generateStaticParams() {
  return getSellableKeepsakes().map((product) => ({ id: product.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getSellableKeepsake(params.id)
  const path = `/store/${params.id}`
  if (!product) {
    return pageMetadata({
      title: "Keepsake | MemorialsQR",
      description: "This keepsake is not available to order.",
      path,
      index: false,
    })
  }

  const copy = keepsakePageCopy(product)
  assertMetadataLength(copy.title, copy.description, copy.path)
  return pageMetadata({ title: copy.title, description: copy.description, path: copy.path })
}

export default function KeepsakePage({ params }: { params: { id: string } }) {
  const product = getSellableKeepsake(params.id)
  if (!product) notFound()
  const relatedId = relatedHandmadePlaqueId(product.id)
  const related = relatedId ? getSellableKeepsake(relatedId) : undefined
  const faqs = keepsakeFaqs(product.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={keepsakeProductJsonLd(product)} />
      {faqs.length > 0 ? <JsonLd data={keepsakeFaqJsonLd(faqs)} /> : null}
      <TrackViewContent contentId={product.id} contentName={product.name} value={product.price} />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/store", label: "QR Memorial Keepsakes" },
            { href: `/store/${product.id}`, label: product.name },
          ]}
        />
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-white md:col-start-1 md:row-start-1">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-contain"
              priority
              quality={60}
            />
          </div>
          <Card className="max-md:order-first md:col-start-2 md:row-start-1">
            <CardContent className="space-y-5 p-6">
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              <KeepsakePurchaseDetails product={product} />
              {related ? (
                <p className="text-sm text-muted-foreground">
                  {related.category === "Pet" ? "For a dog, cat, or other companion, see the " : "For a person, see the "}
                  <Link href={`/store/${related.id}`} className="underline">
                    {related.name}
                  </Link>
                  {". It is the same kind of metal plaque, at the same price."}
                </p>
              ) : null}
              <p className="text-muted-foreground">{product.description}</p>
              <nav aria-label="Ways to use this keepsake" className="space-y-2 border-t pt-4">
                <p className="text-sm">
                  <Link href="/guides" className="underline">
                    Memorial guides
                  </Link>
                  {" · "}
                  <Link href="/gifts" className="underline">
                    Gift ideas
                  </Link>
                </p>
                <h2 className="text-sm font-semibold">Ways families use it</h2>
                <ul className="space-y-1 text-sm">
                  {buyerIntentList.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path} className="underline">
                        {item.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
                <h2 className="pt-2 text-sm font-semibold">Gift ideas</h2>
                <ul className="space-y-1 text-sm">
                  {giftIntentList.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path} className="underline">
                        {item.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>
        {faqs.length > 0 ? (
          <section className="mt-10 space-y-4" aria-label="Questions about this plaque">
            <h2 className="text-2xl font-semibold text-foreground">Questions before you order</h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </section>
        ) : null}
        <ProductReviews productId={product.id} />
      </main>
    </div>
  )
}
