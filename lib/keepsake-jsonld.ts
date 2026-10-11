import type { SellableKeepsake } from "@/lib/fulfillment-availability"
import {
  absoluteAssetUrl,
  KEEPSAKE_HANDLING_MAX_DAYS,
  KEEPSAKE_HANDLING_MIN_DAYS,
  KEEPSAKE_SHIPPING_PRICE_USD,
  MONEY_BACK_GUARANTEE_DAYS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

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
  const details: {
    "@type": "OfferShippingDetails"
    shippingRate: { "@type": "MonetaryAmount"; value: string; currency: "USD" }
    shippingDestination: { "@type": "DefinedRegion"; addressCountry: "US" }
    deliveryTime?: {
      "@type": "ShippingDeliveryTime"
      handlingTime: {
        "@type": "QuantitativeValue"
        minValue: number
        maxValue: number
        unitCode: "DAY"
      }
    }
  } = {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: KEEPSAKE_SHIPPING_PRICE_USD,
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

/**
 * Return policy stated on the terms, FAQ, checkout, and security pages.
 * Return shipping fees and return method are not stated, so they are omitted.
 */
function merchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy" as const,
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: MONEY_BACK_GUARANTEE_DAYS,
    merchantReturnLink: `${SITE_URL}/terms-of-service`,
  }
}

/** Product + Offer structured data for one keepsake a buyer can purchase. */
export function keepsakeProductJsonLd(product: SellableKeepsake) {
  return {
    "@context": "https://schema.org",
    "@type": "Product" as const,
    name: product.name,
    description: product.description,
    sku: product.id,
    image: absoluteAssetUrl(product.image),
    brand: {
      "@type": "Brand" as const,
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer" as const,
      url: `${SITE_URL}/store/${product.id}`,
      priceCurrency: "USD" as const,
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: shippingDetails(product),
      hasMerchantReturnPolicy: merchantReturnPolicy(),
      eligibleRegion: {
        "@type": "Country" as const,
        name: "US",
      },
      seller: {
        "@type": "Organization" as const,
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  }
}
