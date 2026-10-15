import { CONCIERGE_PRODUCTS } from "@/lib/catalog"
import { getSellableKeepsakes, type SellableKeepsake } from "@/lib/fulfillment-availability"
import type { EnvSource } from "@/lib/fulfillment-readiness"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { keepsakeProductJsonLd } from "@/lib/keepsake-jsonld"
import { formatUsd, SITE_URL } from "@/lib/site"

export const KEEPSAKE_COLLECTION_PATH = "/keepsakes"

export const KEEPSAKE_COLLECTION_TITLE = "Keepsakes You Can Order | MemorialsQR"

export const KEEPSAKE_COLLECTION_DESCRIPTION =
  "Order a sympathy keepsake Square checkout accepts today, at the catalog price. Metal plaques stay on the waitlist. Hosting is included."

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
      answer: `The price is a one-time payment. Shipping to United States addresses is included. The memorial page includes ${HOSTING_INCLUDED_YEARS} years of hosting. There is no monthly fee.`,
    },
    {
      question: "Can I send a keepsake as a sympathy gift?",
      answer:
        "Yes, for a keepsake that is listed here. At checkout, mark the order as a gift, enter the recipient's name, and use their address if it is different from yours. A short message is saved with the order. It is not engraved.",
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

/** ItemList of keepsakes checkout will charge, plus FAQ. Coming-soon plaques are omitted. */
export function keepsakeCollectionJsonLd(products: SellableKeepsake[]) {
  const forSale = products.filter((product) => product.available)
  const faqs = collectionFaqs()
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...(forSale.length > 0
        ? [
            {
              "@type": "ItemList",
              name: "Keepsakes you can order",
              url: `${SITE_URL}${KEEPSAKE_COLLECTION_PATH}`,
              numberOfItems: forSale.length,
              itemListElement: forSale.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: productNode(product),
              })),
            },
          ]
        : []),
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
