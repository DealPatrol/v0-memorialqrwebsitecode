import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

export type FuneralHomeFaq = {
  question: string
  answer: string
}

export function funeralHomePartnerFaqs(plaque?: { name: string; price: number } | null): FuneralHomeFaq[] {
  const price = formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)
  const plaqueAnswer = plaque
    ? `A ${plaque.name} is ${formatUsd(plaque.price)} when a family orders it themselves. This inquiry does not change that price.`
    : "Metal plaques are coming soon. We are not taking plaque orders. This inquiry does not promise a wholesale price."

  return [
    {
      question: "Does this form place an order?",
      answer:
        "No. It is a partner inquiry. We reply by email. It does not place an order, charge a card, or set a price.",
    },
    {
      question: "What can a family order today?",
      answer: `A digital memorial page for ${price}. They receive the page and a QR code by email. Nothing is shipped. A funeral home can place that code on a program it already prints. We do not print programs. Hosting for ${HOSTING_INCLUDED_YEARS} years is included.`,
    },
    {
      question: "Do you sell plaques to funeral homes right now?",
      answer: plaqueAnswer,
    },
  ]
}

export function funeralHomePartnerJsonLd(faqs: FuneralHomeFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: faq.answer,
      },
    })),
  }
}
