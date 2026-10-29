import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { PRIORITY_BUYER_LINKS } from "@/lib/buyer-path-links"
import { plaqueCostFaqJsonLd, qrMemorialPlaqueCostFaq } from "@/lib/plaque-cost-faq"
import { SITE_URL } from "@/lib/site"

export function PlaqueCostAnswer({
  className = "bg-white px-4 py-12",
  pagePath = "/",
}: {
  className?: string
  pagePath?: string
}) {
  const faq = qrMemorialPlaqueCostFaq()
  return (
    <section id="qr-memorial-plaque-cost" className={className}>
      <JsonLd data={plaqueCostFaqJsonLd(faq, `${SITE_URL}${pagePath}`)} />
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold text-foreground">{faq.question}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{faq.answer}</p>
        <nav aria-label="Memorial pages you can order" className="mt-6">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {PRIORITY_BUYER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
