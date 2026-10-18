export type LeadType = "funeral-home" | "memorial-guide"

export type CommerceEvent =
  | {
      name: "ViewContent"
      value: number
      currency: "USD"
      contentId: string
      contentName: string
      /** First digital-memorial selling page in this browser tab, when known. */
      landingPath?: string
    }
  | {
      name: "InitiateCheckout"
      value: number
      currency: "USD"
      contentId?: string
      landingPath?: string
    }
  | {
      name: "Purchase"
      value: number
      currency: "USD"
      transactionId: string
      contentId?: string
      landingPath?: string
    }
  | {
      name: "Lead"
      leadType: LeadType
    }

/** Selling page that started this visit, for view, checkout, and purchase events. */
export function commerceLandingPath(event: CommerceEvent): string | undefined {
  switch (event.name) {
    case "ViewContent":
    case "InitiateCheckout":
    case "Purchase":
      return event.landingPath
    case "Lead":
      return undefined
    default: {
      const exhaustive: never = event
      return exhaustive
    }
  }
}

/** Custom properties sent to Vercel Analytics with a commerce event. */
export function commerceAnalyticsProperties(event: CommerceEvent): Record<string, string | number> {
  const landingPath = commerceLandingPath(event)
  switch (event.name) {
    case "ViewContent": {
      const properties: Record<string, string | number> = {
        value: event.value,
        currency: event.currency,
        content_id: event.contentId,
        content_name: event.contentName,
      }
      if (landingPath) properties.landing_path = landingPath
      return properties
    }
    case "InitiateCheckout": {
      const properties: Record<string, string | number> = {
        value: event.value,
        currency: event.currency,
      }
      if (event.contentId) properties.content_id = event.contentId
      if (landingPath) properties.landing_path = landingPath
      return properties
    }
    case "Purchase": {
      const properties: Record<string, string | number> = {
        value: event.value,
        currency: event.currency,
        transaction_id: event.transactionId,
      }
      if (event.contentId) properties.content_id = event.contentId
      if (landingPath) properties.landing_path = landingPath
      return properties
    }
    case "Lead":
      return { lead_type: event.leadType }
    default: {
      const exhaustive: never = event
      return exhaustive
    }
  }
}

export function ga4EventName(name: CommerceEvent["name"]): string {
  switch (name) {
    case "ViewContent":
      return "view_item"
    case "InitiateCheckout":
      return "begin_checkout"
    case "Purchase":
      return "purchase"
    case "Lead":
      return "generate_lead"
    default: {
      const exhaustive: never = name
      return exhaustive
    }
  }
}

/** Pinterest standard events, plus a custom initiatecheckout event. */
export function pinterestEventName(name: CommerceEvent["name"]): string {
  switch (name) {
    case "ViewContent":
      return "pagevisit"
    case "InitiateCheckout":
      return "initiatecheckout"
    case "Purchase":
      return "checkout"
    case "Lead":
      return "lead"
    default: {
      const exhaustive: never = name
      return exhaustive
    }
  }
}

function moneyParams(event: CommerceEvent): { value: number; currency: "USD" } | null {
  switch (event.name) {
    case "ViewContent":
    case "InitiateCheckout":
    case "Purchase":
      return { value: event.value, currency: event.currency }
    case "Lead":
      return null
    default: {
      const exhaustive: never = event
      return exhaustive
    }
  }
}

export function metaEventParams(event: CommerceEvent): Record<string, unknown> {
  const money = moneyParams(event)
  switch (event.name) {
    case "ViewContent":
      return {
        ...money,
        content_ids: [event.contentId],
        content_name: event.contentName,
        content_type: "product",
      }
    case "InitiateCheckout":
      return {
        ...money,
        content_ids: event.contentId ? [event.contentId] : undefined,
      }
    case "Purchase":
      return {
        ...money,
        content_ids: event.contentId ? [event.contentId] : undefined,
        content_type: "product",
      }
    case "Lead":
      return { content_name: event.leadType }
    default: {
      const exhaustive: never = event
      return exhaustive
    }
  }
}

export function googleAdsConversion(
  event: CommerceEvent,
  sendTo: string | null,
): { send_to: string; value: number; currency: "USD"; transaction_id: string } | null {
  if (event.name !== "Purchase" || !sendTo) return null
  return {
    send_to: sendTo,
    value: event.value,
    currency: event.currency,
    transaction_id: event.transactionId,
  }
}

/** Purchase is reportable only after checkout processing confirms the paid order. */
export function purchaseAfterPayment(order: {
  success?: boolean
  amount?: unknown
  currency?: unknown
  orderNumber?: unknown
  contentId?: string
} | null): Extract<CommerceEvent, { name: "Purchase" }> | null {
  if (!order || order.success !== true) return null
  if (order.currency !== "USD") return null
  if (typeof order.amount !== "number" || !Number.isFinite(order.amount) || order.amount <= 0) return null
  if (typeof order.orderNumber !== "string" || order.orderNumber.trim().length === 0) return null
  return {
    name: "Purchase",
    value: Math.round(order.amount * 100) / 100,
    currency: "USD",
    transactionId: order.orderNumber,
    contentId: order.contentId,
  }
}
