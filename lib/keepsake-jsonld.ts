import type { SellableKeepsake } from "@/lib/fulfillment-availability"
import { SITE_NAME, SITE_URL } from "@/lib/site"

/** Product + Offer structured data for one keepsake page. */
export function keepsakeProductJsonLd(product: SellableKeepsake) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    image: `${SITE_URL}${product.image}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/store/${product.id}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      eligibleRegion: {
        "@type": "Country",
        name: "US",
      },
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  }
}
