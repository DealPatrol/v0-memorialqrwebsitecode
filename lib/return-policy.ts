import { MONEY_BACK_GUARANTEE_DAYS, SITE_URL } from "@/lib/site"

/**
 * 30-day money-back guarantee stated in the terms, the FAQ, checkout, and the security page.
 * The site does not say who pays return shipping or how an item is sent back, so those fields are omitted.
 */
export function statedMerchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy" as const,
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: MONEY_BACK_GUARANTEE_DAYS,
    merchantReturnLink: `${SITE_URL}/terms-of-service`,
  }
}
