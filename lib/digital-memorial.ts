import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { absoluteAssetUrl, SITE_NAME, SITE_URL } from "@/lib/site"

export const DIGITAL_MEMORIAL_PATH = "/digital-memorial"

export const DIGITAL_MEMORIAL_TITLE = "Order a Digital Memorial | MemorialsQR"

export const DIGITAL_MEMORIAL_META_DESCRIPTION = `An online memorial page and a QR code you can print or share. $${DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2)} once, with ${HOSTING_INCLUDED_YEARS} years of hosting included. Nothing is shipped.`

/** Body copy and Product JSON-LD. Longer than the meta description. */
export const DIGITAL_MEMORIAL_DESCRIPTION = `An online memorial page for photos, stories, and messages, and a QR code you can print or share. Nothing is shipped. The price includes ${HOSTING_INCLUDED_YEARS} years of hosting from the order date. You add the photos and stories yourself. We do not sell flowers, urns, or jewelry.`

export const DIGITAL_MEMORIAL_IMAGE = "/brand-logo.png"

export function digitalMemorialFeatures(): string[] {
  return [
    "Online memorial page for photos, stories, and messages",
    "A QR code you can print or share",
    `${HOSTING_INCLUDED_YEARS} years of hosting from the order date, with no monthly fee`,
    "You add the photos and stories yourself",
    "Nothing is shipped",
  ]
}

export function digitalMemorialFaqs(): { question: string; answer: string }[] {
  return [
    {
      question: "What do I get after I pay?",
      answer: `An online memorial page and a QR code you can print or share. The confirmation email includes the page link and a PNG of the QR code. Nothing is mailed. Hosting for ${HOSTING_INCLUDED_YEARS} years starts on the order date.`,
    },
    {
      question: "Do you write the page or send flowers?",
      answer:
        "No. You add the photos and stories. We do not sell flowers, urns, or jewelry. If you want us to build the page, the concierge service is a separate purchase and nothing is shipped for that service either.",
    },
    {
      question: "Whose name is on the page?",
      answer:
        "Put the name on the first line of the order notes. That line becomes the title of the page. If you leave the notes blank, the page title is In Loving Memory, and you can add the name later.",
    },
  ]
}

/** Product structured data with one Offer at the catalog price. Nothing ships, so there is no shipping rate. */
export function digitalMemorialJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product" as const,
    name: DIGITAL_MEMORIAL_PRODUCT.name,
    description: DIGITAL_MEMORIAL_DESCRIPTION,
    sku: DIGITAL_MEMORIAL_PRODUCT.id,
    image: absoluteAssetUrl(DIGITAL_MEMORIAL_IMAGE),
    brand: {
      "@type": "Brand" as const,
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer" as const,
      url: `${SITE_URL}${DIGITAL_MEMORIAL_PATH}`,
      priceCurrency: "USD" as const,
      price: DIGITAL_MEMORIAL_PRODUCT.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization" as const,
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  }
}

export function digitalMemorialFaqJsonLd() {
  const faqs = digitalMemorialFaqs()
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
