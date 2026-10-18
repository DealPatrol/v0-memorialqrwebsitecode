"use client"

import { track } from "@vercel/analytics"
import {
  commerceAnalyticsProperties,
  commerceLandingPath,
  googleAdsConversion,
  metaEventParams,
  pinterestEventName,
  ga4EventName,
  type CommerceEvent,
} from "@/lib/ad-events"

type AdsWindow = Window & {
  fbq?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
  pintrk?: (...args: unknown[]) => void
  va?: (...args: unknown[]) => void
  vaq?: unknown[][]
  __MQR_ADS_SEND_TO?: string | null
}

export function trackCommerce(event: CommerceEvent) {
  if (typeof window === "undefined") return
  const ads = window as AdsWindow
  const money = event.name === "Lead" ? undefined : { value: event.value, currency: event.currency }

  if (typeof ads.fbq === "function") {
    ads.fbq("track", event.name, metaEventParams(event))
  }

  const itemId = commerceContentId(event)
  const itemName = event.name === "ViewContent" ? event.contentName : itemId

  const landingPath = commerceLandingPath(event)

  if (typeof ads.gtag === "function") {
    ads.gtag("event", ga4EventName(event.name), {
      ...money,
      transaction_id: event.name === "Purchase" ? event.transactionId : undefined,
      items: itemId ? [{ item_id: itemId, item_name: itemName }] : undefined,
      ...(landingPath ? { landing_path: landingPath } : {}),
    })
    const conversion = googleAdsConversion(event, ads.__MQR_ADS_SEND_TO ?? null)
    if (conversion) ads.gtag("event", "conversion", conversion)
  }

  if (typeof ads.pintrk === "function") {
    ads.pintrk("track", pinterestEventName(event.name), {
      ...money,
      order_id: event.name === "Purchase" ? event.transactionId : undefined,
      lead_type: event.name === "Lead" ? event.leadType : undefined,
    })
  }

  ensureVercelQueue(ads)
  track(ga4EventName(event.name), commerceAnalyticsProperties(event))
}

/** Match the Vercel Analytics queue so an event fired before the script loads is kept. */
function ensureVercelQueue(win: AdsWindow) {
  if (typeof win.va === "function") return
  win.va = (...params: unknown[]) => {
    win.vaq = win.vaq || []
    win.vaq.push(params)
  }
}

function commerceContentId(event: CommerceEvent): string | undefined {
  switch (event.name) {
    case "ViewContent":
      return event.contentId
    case "Purchase":
      return event.contentId
    case "InitiateCheckout":
      return event.contentId
    case "Lead":
      return undefined
    default: {
      const exhaustive: never = event
      return exhaustive
    }
  }
}
