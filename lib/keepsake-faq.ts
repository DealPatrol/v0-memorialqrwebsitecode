import { PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { KEEPSAKE_SHIPPING_COPY, SUPPORT_EMAIL } from "@/lib/site"

export type KeepsakeFaq = {
  question: string
  answer: string
}

type HandmadePlaqueId = typeof QR_MEMORIAL_PLAQUE_ID | typeof PET_MEMORIAL_PLAQUE_ID

function isHandmadePlaqueId(id: string): id is HandmadePlaqueId {
  return id === QR_MEMORIAL_PLAQUE_ID || id === PET_MEMORIAL_PLAQUE_ID
}

function nameLine(id: HandmadePlaqueId): string {
  switch (id) {
    case QR_MEMORIAL_PLAQUE_ID:
      return "Put the name on the first line of the order notes, then the dates and the finish: gold, silver, or black."
    case PET_MEMORIAL_PLAQUE_ID:
      return "Put the pet's name on the first line of the order notes, then the dates and the finish: gold, silver, or black."
    default: {
      const exhaustive: never = id
      return exhaustive
    }
  }
}

/**
 * Shipping, fulfillment, hosting, and refund answers already published on the site.
 * Shown on the handmade plaque product pages.
 */
export function keepsakeFaqs(productId: string): KeepsakeFaq[] {
  if (!isHandmadePlaqueId(productId)) return []
  return [
    {
      question: "How soon does the plaque ship?",
      answer: KEEPSAKE_SHIPPING_COPY,
    },
    {
      question: "What happens after I purchase?",
      answer: `We create the memorial page when the order is paid, and the QR code on the plaque already opens it. ${nameLine(productId)} We make the plaque in Alabama and email you when it ships. You can add photos and stories when you are ready.`,
    },
    {
      question: "How long is the memorial page hosted?",
      answer: `The price includes ${HOSTING_INCLUDED_YEARS} years of hosting for the memorial page, starting on the order date. There is no monthly fee. We will contact you before the included hosting ends to talk about renewal options. You can download the memorial photos at any time.`,
    },
    {
      question: "What is the refund policy?",
      answer: `Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with your memorial for any reason, contact us at ${SUPPORT_EMAIL} within 30 days for a full refund.`,
    },
  ]
}

export function keepsakeFaqJsonLd(faqs: KeepsakeFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
