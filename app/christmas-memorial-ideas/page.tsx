import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { TrackViewContent } from "@/components/track-view-content"
import { Button } from "@/components/ui/button"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { christmasMemorial as page } from "@/lib/christmas-memorial"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH, DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { pageMetadata, publicPages } from "@/lib/seo"
import { SISTER_SHOP_CHRISTMAS_URL } from "@/lib/sister-shop"
import { formatUsd, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata = pageMetadata(publicPages.christmasMemorialIdeas)

const url = `${SITE_URL}${page.path}`
const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.h1,
      description: page.description,
      url,
      datePublished: "2026-11-24",
      dateModified: "2026-11-24",
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: page.howTo.name,
      totalTime: page.howTo.totalTime,
      estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2) },
      step: page.howTo.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${url}#step-${index + 1}`,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
}

export default function ChristmasMemorialIdeasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <JsonLd data={jsonLd} />
      <TrackViewContent
        contentId={DIGITAL_MEMORIAL_PRODUCT.id}
        contentName={DIGITAL_MEMORIAL_PRODUCT.name}
        value={DIGITAL_MEMORIAL_PRODUCT.price}
        landingPath={page.path}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/guides", label: "Guides" },
            { href: page.path, label: "Christmas memorial ideas" },
          ]}
        />
        <article className="space-y-8">
          <h1 className="text-4xl font-bold text-foreground">{page.h1}</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{page.answer}</p>

          <section className="space-y-3 rounded-lg border border-border bg-background p-4">
            <h2 className="text-xl font-semibold text-foreground">Order the page and QR code today</h2>
            <p className="text-muted-foreground">
              {price} once. The page is online when the order is paid, and the QR code is emailed as a PNG. Nothing is shipped, so there is
              no shipping deadline before Christmas.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Buy the digital memorial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={page.examplePath}>See the example holiday page</Link>
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Small ways to include them</h2>
            <ul className="space-y-3">
              {page.ideas.map((idea) => (
                <li key={idea.title}>
                  <h3 className="font-semibold text-foreground">{idea.title}</h3>
                  <p className="text-muted-foreground">{idea.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">{page.howTo.name}</h2>
            <ol className="list-decimal space-y-3 pl-6">
              {page.howTo.steps.map((step, index) => (
                <li key={step.name} id={`step-${index + 1}`} className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{step.name}.</span> {step.text}
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Memory prompts for the family</h2>
            <p className="text-muted-foreground">If people do not know what to write, give them one of these to finish.</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              {page.memoryPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Questions families ask</h2>
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </section>

          <section className="space-y-2 text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">Related</h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <Link className="underline" href={DIGITAL_MEMORIAL_PATH}>
                  The digital memorial page
                </Link>
              </li>
              <li>
                <Link className="underline" href="/memorial-page-for-family-far-away">
                  A memorial page for family far away
                </Link>
              </li>
              <li>
                <Link className="underline" href="/sympathy-gift-ideas">
                  Sympathy gift ideas
                </Link>
              </li>
              <li>
                <a className="underline" href={SISTER_SHOP_CHRISTMAS_URL} rel="noopener">
                  Personalized Christmas ornaments at Custom Gifts Online, our sister shop
                </a>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
}
