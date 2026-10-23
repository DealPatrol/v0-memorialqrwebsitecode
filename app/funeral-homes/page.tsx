import Link from "next/link"
import { Header } from "@/components/header"
import { FuneralHomeInquiryForm } from "@/components/funeral-home-inquiry-form"
import { JsonLd } from "@/components/json-ld"
import { Card, CardContent } from "@/components/ui/card"
import { buyerIntentList, PRIMARY_KEEPSAKE_ID } from "@/lib/buyer-intent"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { serviceLandingList } from "@/lib/digital-landing"
import { DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import { funeralHomePartnerFaqs, funeralHomePartnerJsonLd } from "@/lib/funeral-homes"
import { getSellableKeepsake } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

export const metadata = pageMetadata(publicPages.funeralHomes)

export default function FuneralHomesPage() {
  const plaque = getSellableKeepsake(PRIMARY_KEEPSAKE_ID)
  const faqs = funeralHomePartnerFaqs(plaque)
  const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={funeralHomePartnerJsonLd(faqs)} />
      <Header />
      <main className="mx-auto grid max-w-5xl items-start gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="space-y-5">
          <h1 className="text-4xl font-bold text-foreground">For funeral homes</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Families planning a service often ask for one page guests can open from a phone. A QR code on a program can
            do that. Guests do not need an app or an account.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            A family can order a digital memorial page today for {price}. They receive the page and a QR code by email.
            Nothing is shipped. Your funeral home can place that code on a program you already print. We do not print
            programs. Hosting for {HOSTING_INCLUDED_YEARS} years is included.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {plaque
              ? `A metal ${plaque.name} is ${formatUsd(plaque.price)} when a family orders it themselves. This inquiry does not change that price.`
              : "Metal plaques are coming soon. We are not taking plaque orders, and this inquiry does not promise a wholesale price."}{" "}
            If you want to talk about offering a memorial QR code to the families you serve, send a partner inquiry. We
            reply by email. This form does not place an order and does not charge a card.
          </p>
          <nav aria-label="Service pages" className="space-y-2">
            <h2 className="text-xl font-semibold">Pages for a service</h2>
            <ul className="space-y-1">
              {serviceLandingList.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="underline">
                    {item.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={DIGITAL_MEMORIAL_PATH} className="underline">
                  Digital memorial page, {price}
                </Link>
              </li>
              <li>
                <Link href={EXAMPLE_MEMORIAL_PATH} className="underline">
                  Example memorial page
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Family guides" className="space-y-2">
            <h2 className="text-xl font-semibold">Other pages families use</h2>
            <ul className="space-y-1">
              {buyerIntentList.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="underline">
                    {item.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Questions about this inquiry</h2>
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </section>
        </article>
        <Card id="inquiry">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Partner inquiry</h2>
            <p className="text-sm text-muted-foreground">
              Tell us about your funeral home. We reply by email. This does not place an order or set a price.
            </p>
            <FuneralHomeInquiryForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
