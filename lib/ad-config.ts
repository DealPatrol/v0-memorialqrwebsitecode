const META_PIXEL = /^[0-9]{5,20}$/
const GA4 = /^G-[A-Z0-9]+$/
const GOOGLE_ADS = /^AW-\d+$/
const PURCHASE_LABEL = /^[A-Za-z0-9_-]{1,40}$/
const PINTEREST = /^[0-9]{5,20}$/

export type AdConfig = {
  metaPixelId: string | null
  ga4Id: string | null
  googleAdsId: string | null
  googleAdsPurchaseLabel: string | null
  pinterestTagId: string | null
}

function match(value: string | undefined, pattern: RegExp): string | null {
  const trimmed = value?.trim()
  if (!trimmed || !pattern.test(trimmed)) return null
  return trimmed
}

/** Pixels load only when the matching public env var is set and valid. */
export function readAdConfig(env: Record<string, string | undefined>): AdConfig {
  return {
    metaPixelId: match(env.NEXT_PUBLIC_META_PIXEL_ID, META_PIXEL),
    ga4Id: match(env.NEXT_PUBLIC_GA4_ID, GA4),
    googleAdsId: match(env.NEXT_PUBLIC_GOOGLE_ADS_ID, GOOGLE_ADS),
    googleAdsPurchaseLabel: match(env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL, PURCHASE_LABEL),
    pinterestTagId: match(env.NEXT_PUBLIC_PINTEREST_TAG_ID, PINTEREST),
  }
}

export function googleAdsSendTo(config: AdConfig): string | null {
  if (!config.googleAdsId || !config.googleAdsPurchaseLabel) return null
  return `${config.googleAdsId}/${config.googleAdsPurchaseLabel}`
}

export function adsEnabled(config: AdConfig): boolean {
  return Boolean(config.metaPixelId || config.ga4Id || config.googleAdsId || config.pinterestTagId)
}
