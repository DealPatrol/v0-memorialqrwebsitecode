"use client"

import { googleAdsConversion, metaEventParams, pinterestEventName, ga4EventName, type CommerceEvent } from "@/lib/ad-events"

type AdsWindow = Window & {
  fbq?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
  pintrk?: (...args: unknown[]) => void
  __MQR_ADS_SEND_TO?: string | null
}

export function trackCommerce(event: CommerceEvent) {
  if (typeof window === "undefined") return
  const ads = window as AdsWindow
  const money = event.name === "Lead" ? undefined : { value: event.value, currency: event.currency }

  if (typeof ads.fbq === "function") {
    ads.fbq("track", event.name, metaEventParams(event))
  }

  if (typeof ads.gtag === "function") {
    ads.gtag("event", ga4EventName(event.name), {
      ...money,
      transaction_id: event.name === "Purchase" ? event.transactionId : undefined,
      items:
        event.name === "ViewContent" || event.name === "Purchase"
          ? [{ item_id: event.contentId, item_name: event.name === "ViewContent" ? event.contentName : event.contentId }]
          : undefined,
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
}
