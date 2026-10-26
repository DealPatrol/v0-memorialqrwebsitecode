import { DIGITAL_MEMORIAL_PRODUCT, PLAQUE_PRICE } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

export type PlaqueCostFaq = {
  question: string
  answer: string
}

/**
 * Prices are the catalog amounts already shown on the site.
 * Both metal plaques are listed and not for sale until a supplier exists.
 */
export function qrMemorialPlaqueCostFaq(): PlaqueCostFaq {
  const digital = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
  const plaque = formatUsd(PLAQUE_PRICE)
  return {
    question: "How much does a QR memorial plaque cost?",
    answer: `The QR Memorial Plaque and the Pet Memorial QR Plaque are each ${plaque}. Both are coming soon and are not for sale yet. Joining the waitlist does not charge a card. A digital memorial page is ${digital} and can be ordered today. It includes the page, a QR code you can print or share, and ${HOSTING_INCLUDED_YEARS} years of hosting. Nothing is shipped.`,
  }
}

export function plaqueCostFaqJsonLd(faq: PlaqueCostFaq = qrMemorialPlaqueCostFaq()) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: [
      {
        "@type": "Question" as const,
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: faq.answer,
        },
      },
    ],
  }
}
