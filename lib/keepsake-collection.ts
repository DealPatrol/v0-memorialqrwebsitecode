import { CONCIERGE_PRODUCTS, DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { digitalMemorialJsonLd } from "@/lib/digital-memorial"
import { getSellableKeepsakes, type SellableKeepsake } from "@/lib/fulfillment-availability"
import type { EnvSource } from "@/lib/fulfillment-readiness"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { keepsakeProductJsonLd } from "@/lib/keepsake-jsonld"
import { formatUsd, SITE_URL } from "@/lib/site"

export const KEEPSAKE_COLLECTION_PATH = "/keepsakes"

export const KEEPSAKE_COLLECTION_TITLE = "Keepsakes You Can Order | MemorialsQR"

export const KEEPSAKE_COLLECTION_DESCRIPTION =
  "Order a digital memorial page today. Metal plaques stay on the waitlist. Hosting is included, and nothing ships for the digital page."

export type CollectionFaq = { question: string; answer: string }

function requireConcierge() {
  const product = CONCIERGE_PRODUCTS.find((item) => item.id === "concierge-digital")
  if (!product) throw new Error("Concierge digital offer is missing from the catalog")
  return product
}

export const CONCIERGE_CHECKOUT_PRODUCT = requireConcierge()

export function collectionFaqs(): CollectionFaq[] {
  return [
    {
      question: "Which keepsakes can I order today?",
      answer:
        "Only the keepsakes listed on this page. Each price is the amount Square charges at checkout. If a keepsake is not listed, it cannot be ordered.",
    },
    {
      question: "Are the metal plaques for sale?",
      answer:
        "No. The QR Memorial Plaque and the Pet Memorial QR Plaque are coming soon. Join the waitlist and we will email you once when one can be ordered. Joining the list does not charge a card.",
    },
    {
      question: "What does the keepsake price include?",
      answer: `The digital memorial page is ${formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}, paid once. Nothing is shipped. The page includes ${HOSTING_INCLUDED_YEARS} years of hosting. There is no monthly fee. A printed keepsake, when one is listed on this page, includes shipping to a United States address.`,
    },
    {
      question: "Can I send a keepsake as a sympathy gift?",
      answer:
        "The digital memorial page is not a shipped gift. After you pay, you can share the page link and the QR code. A printed keepsake that is listed here can be marked as a gift at checkout, with the recipient's name and address if it should ship to them. A short message is saved with that order. It is not engraved.",
    },
    {
      question: "Can you build the memorial page for us?",
      answer: `Yes. The concierge service is ${formatUsd(CONCIERGE_CHECKOUT_PRODUCT.price)}, a separate purchase. We build the memorial page and send the link. Nothing is shipped for that service.`,
    },
  ]
}

function productNode(product: SellableKeepsake) {
  const full = keepsakeProductJsonLd(product)
  return {
    "@type": full["@type"],
    name: full.name,
    description: full.description,
    sku: full.sku,
    image: full.image,
    brand: full.brand,
    offers: full.offers,
  }
}

function digitalListItem() {
  const full = digitalMemorialJsonLd()
  return {
    "@type": full["@type"],
    name: full.name,
    description: full.description,
    sku: full.sku,
    image: full.image,
    brand: full.brand,
    offers: full.offers,
  }
}

/** ItemList of keepsakes checkout will charge, plus FAQ. Coming-soon plaques are omitted. */
export function keepsakeCollectionJsonLd(products: SellableKeepsake[]) {
  const forSale = products.filter((product) => product.available)
  const items = [digitalListItem(), ...forSale.map((product) => productNode(product))]
  const faqs = collectionFaqs()
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Keepsakes you can order",
        url: `${SITE_URL}${KEEPSAKE_COLLECTION_PATH}`,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item,
        })),
      },
      {
        "@type": "Service",
        name: CONCIERGE_CHECKOUT_PRODUCT.name,
        serviceType: "Memorial page concierge",
        url: `${SITE_URL}/concierge`,
        provider: {
          "@type": "Organization",
          name: "MemorialsQR",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/concierge`,
          priceCurrency: "USD",
          price: CONCIERGE_CHECKOUT_PRODUCT.price.toFixed(2),
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }
}

export function keepsakesForCollection(env: EnvSource = process.env): SellableKeepsake[] {
  return getSellableKeepsakes(env).filter((product) => product.available)
}
