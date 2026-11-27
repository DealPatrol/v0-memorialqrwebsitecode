import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { JsonLd } from "@/components/json-ld"
import { ObituaryWriter } from "@/components/obituary-writer"
import { TrackViewContent } from "@/components/track-view-content"
import { Button } from "@/components/ui/button"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH, DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { obituaryPage as page } from "@/lib/obituary"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata = pageMetadata(publicPages.obituaryTemplate)

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
      datePublished: "2026-11-27",
      dateModified: "2026-11-27",
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#writer`,
      name: "Free obituary writer",
      url: `${url}#writer`,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: page.howTo.name,
      totalTime: page.howTo.totalTime,
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

export default function ObituaryTemplatePage() {
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
            { href: page.path, label: "Obituary template" },
          ]}
        />
        <article className="space-y-8">
          <h1 className="text-4xl font-bold text-foreground">{page.h1}</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{page.answer}</p>

          <section id="writer" className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Write the obituary</h2>
            <ObituaryWriter />
          </section>

          <section className="space-y-3 rounded-lg border border-border bg-background p-4">
            <h2 className="text-xl font-semibold text-foreground">Put the full obituary on a memorial page</h2>
            <p className="text-muted-foreground">
              Paste the obituary into the biography, add photos, and let family add their own memories. Share the link, or print the QR code on
              the funeral program so guests can open it. {price} once with {HOSTING_INCLUDED_YEARS} years of hosting. Nothing is shipped.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Create the memorial page</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={EXAMPLE_MEMORIAL_PATH}>See an example page</Link>
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">The obituary template, part by part</h2>
            <ul className="space-y-3">
              {page.parts.map((part) => (
                <li key={part.title}>
                  <h3 className="font-semibold text-foreground">{part.title}</h3>
                  <p className="text-muted-foreground">{part.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">{page.exampleTitle}</h2>
            <p className="whitespace-pre-wrap rounded-md border border-border bg-background p-4 text-foreground">{page.example}</p>
            <p className="text-sm text-muted-foreground">{page.exampleNote}</p>
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
                <Link className="underline" href="/funeral-program-qr-code">
                  A QR code for the funeral program
                </Link>
              </li>
              <li>
                <Link className="underline" href={DIGITAL_MEMORIAL_PATH}>
                  The digital memorial page
                </Link>
              </li>
              <li>
                <Link className="underline" href="/christmas-memorial-ideas">
                  Christmas memorial ideas for the first Christmas
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
}
