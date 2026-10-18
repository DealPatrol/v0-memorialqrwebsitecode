import Link from "next/link"
import QRCode from "qrcode"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DigitalMemorialTrust } from "@/components/digital-memorial-trust"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { RememberDigitalLanding } from "@/components/remember-digital-landing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import {
  DIGITAL_MEMORIAL_CHECKOUT_PATH,
  DIGITAL_MEMORIAL_PATH,
  digitalMemorialJsonLd,
  digitalMemorialPolicyFaqs,
} from "@/lib/digital-memorial"
import {
  EXAMPLE_BIOGRAPHY,
  EXAMPLE_MEMORIAL_NAME,
  EXAMPLE_MEMORIAL_NOTICE,
  EXAMPLE_MEMORIAL_PATH,
  EXAMPLE_MEMORIAL_SETUP,
  EXAMPLE_MESSAGE,
  EXAMPLE_PHOTO_LABEL,
  EXAMPLE_STORY,
  exampleMemorialFaqJsonLd,
  exampleMemorialFaqs,
} from "@/lib/example-memorial"
import { pageMetadata, publicPages } from "@/lib/seo"
import { absoluteAssetUrl, formatUsd } from "@/lib/site"

export const metadata = pageMetadata(publicPages.exampleMemorial)

export default async function ExampleMemorialPage() {
  const besideBuy = new Set(digitalMemorialPolicyFaqs().map((faq) => faq.question))
  const faqs = exampleMemorialFaqs().filter(
    (faq) => faq.question !== "Is this a real memorial?" && !besideBuy.has(faq.question),
  )
  const qrSvg = await exampleQrSvg(absoluteAssetUrl(EXAMPLE_MEMORIAL_PATH))

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={digitalMemorialJsonLd()} />
      <JsonLd data={exampleMemorialFaqJsonLd()} />
      <RememberDigitalLanding pathname={EXAMPLE_MEMORIAL_PATH} />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: DIGITAL_MEMORIAL_PATH, label: DIGITAL_MEMORIAL_PRODUCT.name },
            { href: EXAMPLE_MEMORIAL_PATH, label: "Example" },
          ]}
        />
        <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {EXAMPLE_MEMORIAL_NOTICE}
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">Example memorial page</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{EXAMPLE_MEMORIAL_SETUP}</p>

            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-800 to-slate-900 px-6 py-10 text-center text-white">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-100">Example only</p>
                <div
                  className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-2xl font-semibold"
                  aria-hidden="true"
                >
                  AE
                </div>
                <h2 className="text-3xl font-bold">{EXAMPLE_MEMORIAL_NAME}</h2>
                <p className="mt-3 text-purple-100">Dates you choose appear here. These are not a real lifespan.</p>
              </div>
              <CardContent className="space-y-6 p-6">
                <section>
                  <h3 className="font-semibold text-foreground">About</h3>
                  <p className="mt-2 text-muted-foreground">{EXAMPLE_BIOGRAPHY}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">Photo</h3>
                  <div className="mt-2 flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                    {EXAMPLE_PHOTO_LABEL}
                  </div>
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">{EXAMPLE_STORY.title}</h3>
                  <p className="mt-2 text-muted-foreground">{EXAMPLE_STORY.body}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">Message</h3>
                  <p className="mt-2 text-muted-foreground">{EXAMPLE_MESSAGE.body}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{EXAMPLE_MESSAGE.author}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-foreground">QR code</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The confirmation email includes a PNG like this. On a real order, the code opens that order&apos;s
                    page. This code opens this example.
                  </p>
                  <div
                    className="mt-3 w-44 [&_svg]:h-auto [&_svg]:w-full"
                    role="img"
                    aria-label={`QR code that opens the example memorial for ${EXAMPLE_MEMORIAL_NAME}`}
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                </section>
              </CardContent>
            </Card>
          </article>

          <Card id="order" className="scroll-mt-24">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold">{DIGITAL_MEMORIAL_PRODUCT.name}</h2>
              <p className="text-3xl font-bold">{formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}</p>
              <p className="text-sm text-muted-foreground">
                One-time payment. Nothing is shipped. You add the photos and stories yourself.
              </p>
              <Button asChild className="w-full" size="lg">
                <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Buy the digital memorial</Link>
              </Button>
              <DigitalMemorialTrust />
              <p className="text-sm text-muted-foreground">
                <Link href={DIGITAL_MEMORIAL_PATH} className="underline">
                  Read the full description
                </Link>{" "}
                before you pay.
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10 space-y-4" aria-label="Questions about the example and the digital memorial">
          <h2 className="text-2xl font-semibold text-foreground">Questions before you order</h2>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </section>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{DIGITAL_MEMORIAL_PRODUCT.name}</p>
              <p className="text-sm text-muted-foreground">{formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)} once. Nothing is shipped.</p>
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

/** SVG from the qrcode package. Not user content. */
async function exampleQrSvg(url: string): Promise<string> {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#3b0764", light: "#ffffff" },
  })
  const start = svg.indexOf("<svg")
  return start >= 0 ? svg.slice(start) : svg
}
