import type { SellableKeepsake } from "@/lib/fulfillment-availability"
import { KEEPSAKE_HANDLING_MAX_DAYS, KEEPSAKE_HANDLING_MIN_DAYS, SITE_NAME, SITE_URL } from "@/lib/site"

function includeHandlingTime(provider: SellableKeepsake["provider"]): boolean {
  switch (provider) {
    case "manual":
      return true
    case "printful":
    case "printify":
      return false
    default: {
      const exhaustive: never = provider
      return exhaustive
    }
  }
}

function shippingDetails(product: SellableKeepsake) {
  const details: Record<string, unknown> = {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0.00",
      currency: "USD",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US",
    },
  }

  if (includeHandlingTime(product.provider)) {
    details.deliveryTime = {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: KEEPSAKE_HANDLING_MIN_DAYS,
        maxValue: KEEPSAKE_HANDLING_MAX_DAYS,
        unitCode: "DAY",
      },
    }
  }

  return details
}

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
      shippingDetails: shippingDetails(product),
      eligibleRegion: {
        "@type": "Country",
        name: "US",
      },
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  }
}
