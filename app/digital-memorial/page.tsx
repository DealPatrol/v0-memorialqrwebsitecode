import Link from "next/link"
import { Check } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { TrackViewContent } from "@/components/track-view-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import {
  DIGITAL_MEMORIAL_CHECKOUT_PATH,
  DIGITAL_MEMORIAL_DESCRIPTION,
  DIGITAL_MEMORIAL_PATH,
  digitalMemorialFaqJsonLd,
  digitalMemorialFaqs,
  digitalMemorialFeatures,
  digitalMemorialJsonLd,
} from "@/lib/digital-memorial"
import { serviceLandingList } from "@/lib/digital-landing"
import { EXAMPLE_MEMORIAL_NAME, EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

export const metadata = pageMetadata(publicPages.digitalMemorial)

export default function DigitalMemorialProductPage() {
  const faqs = digitalMemorialFaqs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={digitalMemorialJsonLd()} />
      <JsonLd data={digitalMemorialFaqJsonLd()} />
      <TrackViewContent
        contentId={DIGITAL_MEMORIAL_PRODUCT.id}
        contentName={DIGITAL_MEMORIAL_PRODUCT.name}
        value={DIGITAL_MEMORIAL_PRODUCT.price}
        landingPath={DIGITAL_MEMORIAL_PATH}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/keepsakes", label: "Keepsakes you can order" },
            { href: DIGITAL_MEMORIAL_PATH, label: DIGITAL_MEMORIAL_PRODUCT.name },
          ]}
        />
        <h1 className="mb-4 text-4xl font-bold text-foreground">{DIGITAL_MEMORIAL_PRODUCT.name}</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{DIGITAL_MEMORIAL_DESCRIPTION}</p>

        <Card className="mb-10">
          <CardContent className="space-y-5 p-6">
            <div>
              <p className="text-3xl font-bold">{formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}</p>
              <p className="text-sm text-muted-foreground">
                One-time payment. Nothing is shipped. No recurring fees.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full" size="lg">
                <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Buy</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href={EXAMPLE_MEMORIAL_PATH}>See an example page</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The example page uses a made-up name, {EXAMPLE_MEMORIAL_NAME}, so you can see the page before you pay.
            </p>
            <div>
              <h2 className="text-sm font-semibold text-foreground">What you receive</h2>
              <ul className="mt-2 space-y-2">
                {digitalMemorialFeatures().map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              At checkout, put the name on the first line of the notes. That name is the title of the page. After
              payment, the confirmation email includes the page link and a QR code PNG you can print or share. Hosting
              for {HOSTING_INCLUDED_YEARS} years starts on the order date.
            </p>
            <p className="text-sm text-muted-foreground">
              This is not a metal plaque, and it is not a shipped gift. We do not sell flowers, urns, or jewelry. If
              you want us to write the page,{" "}
              <Link href="/concierge" className="underline">
                the concierge service
              </Link>{" "}
              is a separate purchase.
            </p>
          </CardContent>
        </Card>

        <section className="space-y-4" aria-label="Questions about the digital memorial">
          <h2 className="text-2xl font-semibold text-foreground">Questions before you order</h2>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </section>

        <nav aria-label="Planning a service" className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">Planning a funeral or service</h2>
          <p className="text-muted-foreground">
            The same page and QR code, for a program, a celebration of life, an obituary, or a slideshow.
          </p>
          <ul className="space-y-2">
            {serviceLandingList.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="underline">
                  {item.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/funeral-homes" className="underline">
                For funeral homes
              </Link>
            </li>
            <li>
              <Link href={EXAMPLE_MEMORIAL_PATH} className="underline">
                Example memorial page
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  )
}
