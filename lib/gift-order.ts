import { isMissingPodOrderSchema } from "@/lib/pod-orders"
import { validateEmail } from "@/lib/utils"

/**
 * Gift checkout for a keepsake we ship.
 *
 * Square's CreatePayment call charges the catalog amount only. It does not
 * receive a shipping address. The ship-to that fulfillment uses is the
 * orders.shipping_* columns (manual email and Printful/Printify). When the
 * buyer says the recipient's address differs, those columns are the
 * recipient's address. The buyer's name, email, and phone stay on the order.
 * The gift message is stored for the person packing the keepsake. It is not
 * engraved and it is not the memorial-page name (that still comes from the
 * first line of special_instructions).
 *
 * A digital memorial does not ship. The same gift record stores the
 * recipient's name, email, and short note. The buyer receives the page link
 * and forwards it. We do not email the recipient. The email lives on
 * fulfillment_data.gift, not in a new column, and it does not change the price.
 */

const GIFT_COLUMNS = ["is_gift", "recipient_name", "gift_message", "gift_ship_to_recipient"] as const

export const GIFT_MESSAGE_MAX = 280
export const GIFT_NAME_MAX = 80

export type GiftDelivery = "shipped" | "digital"

export type StoredGift = {
  isGift: boolean
  recipientName: string | null
  giftMessage: string | null
  /** When true, shipping_* is the recipient's address and the package name is the recipient. */
  shipToRecipient: boolean
  /** Set for a digital memorial gift. Nothing is shipped, and we do not email this address. */
  recipientEmail?: string | null
  /** Missing on older shipped-gift rows. Treat that as "shipped". */
  delivery?: GiftDelivery
}

export type GiftOrderRecord = {
  customer_name?: string | null
  is_gift?: boolean | null
  recipient_name?: string | null
  gift_message?: string | null
  gift_ship_to_recipient?: boolean | null
  shipping_address_line1?: string | null
  fulfillment_data?: unknown
}

export const NO_GIFT: StoredGift = {
  isGift: false,
  recipientName: null,
  giftMessage: null,
  shipToRecipient: false,
}

type DatabaseError = { code?: string; message?: string }

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().replace(/\s+/g, " ")
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

function asBoolean(value: unknown): boolean | null {
  if (value === undefined || value === null || value === false) return false
  if (value === true) return true
  return null
}

function parseRecipientEmail(value: unknown): { ok: true; email: string | null } | { ok: false; error: string } {
  if (value === undefined || value === null || value === "") return { ok: true, email: null }
  if (typeof value !== "string") return { ok: false, error: "Enter the recipient's email" }
  const email = value.trim()
  if (!email) return { ok: true, email: null }
  if (email.length > 200 || !validateEmail(email)) return { ok: false, error: "Enter a valid email address for the recipient" }
  return { ok: true, email }
}

export function parseGiftOrder(input: unknown): { ok: true; gift: StoredGift } | { ok: false; error: string } {
  if (input === undefined || input === null) return { ok: true, gift: NO_GIFT }
  if (typeof input !== "object") return { ok: false, error: "Invalid gift details" }
  const body = input as Record<string, unknown>
  const isGift = asBoolean(body.isGift)
  if (isGift === null) return { ok: false, error: "Invalid gift details" }
  if (!isGift) return { ok: true, gift: NO_GIFT }

  if (typeof body.recipientName !== "string") return { ok: false, error: "Enter the recipient's name" }
  const recipientName = body.recipientName.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim()
  if (!recipientName) return { ok: false, error: "Enter the recipient's name" }
  if (recipientName.length > GIFT_NAME_MAX) return { ok: false, error: "Recipient name is too long" }

  const shipToRecipient = asBoolean(body.shipToRecipient)
  if (shipToRecipient === null) return { ok: false, error: "Invalid gift details" }

  const emailParsed = parseRecipientEmail(body.recipientEmail)
  if (!emailParsed.ok) return emailParsed

  if (body.giftMessage === undefined || body.giftMessage === null || body.giftMessage === "") {
    return {
      ok: true,
      gift: { isGift: true, recipientName, giftMessage: null, shipToRecipient, recipientEmail: emailParsed.email },
    }
  }
  if (typeof body.giftMessage !== "string") return { ok: false, error: "Invalid gift message" }
  const message = body.giftMessage.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim()
  if (message.length > GIFT_MESSAGE_MAX) return { ok: false, error: `Gift message must be ${GIFT_MESSAGE_MAX} characters or fewer` }
  return {
    ok: true,
    gift: { isGift: true, recipientName, giftMessage: message || null, shipToRecipient, recipientEmail: emailParsed.email },
  }
}

/**
 * A shipped keepsake keeps the existing gift rules. A digital memorial can be
 * a gift with a recipient email and no address. The catalog price is unchanged.
 */
export function applyGiftDelivery(
  gift: StoredGift,
  shipsPhysical: boolean,
): { ok: true; gift: StoredGift } | { ok: false; error: string } {
  if (!gift.isGift) return { ok: true, gift }
  if (shipsPhysical) return { ok: true, gift: { ...gift, delivery: "shipped" } }
  if (!gift.recipientEmail) return { ok: false, error: "Enter the recipient's email" }
  return { ok: true, gift: { ...gift, shipToRecipient: false, delivery: "digital" } }
}

/** Columns written only for a gift. Non-gift inserts omit them so a missing migration does not block checkout. */
export function giftOrderColumns(gift: StoredGift): {
  is_gift: true
  recipient_name: string | null
  gift_message: string | null
  gift_ship_to_recipient: boolean
} | null {
  if (!gift.isGift) return null
  return {
    is_gift: true,
    recipient_name: gift.recipientName,
    gift_message: gift.giftMessage,
    gift_ship_to_recipient: gift.shipToRecipient,
  }
}

export function isMissingGiftOrderSchema(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const { code, message } = error as DatabaseError
  if (code !== "PGRST204" && code !== "42703") return false
  const normalized = message?.toLowerCase() || ""
  return GIFT_COLUMNS.some((column) => normalized.includes(column))
}

export type OrderInsertPlan = {
  giftColumns: boolean
  pod: boolean
  giftInFulfillment: boolean
}

export function initialOrderInsertPlan(): OrderInsertPlan {
  return { giftColumns: true, pod: true, giftInFulfillment: false }
}

/**
 * Next insert attempt after a schema error.
 * "unsaved-gift" means the gift would not land on the order, so checkout must stop.
 */
export function relaxOrderInsert(
  plan: OrderInsertPlan,
  error: unknown,
  isGift: boolean,
): OrderInsertPlan | "stop" | "unsaved-gift" {
  if (plan.giftColumns && isMissingGiftOrderSchema(error)) {
    if (!plan.pod && isGift) return "unsaved-gift"
    return { giftColumns: false, pod: plan.pod, giftInFulfillment: isGift && plan.pod }
  }
  if (plan.pod && isMissingPodOrderSchema(error)) {
    if (isGift && !plan.giftColumns) return "unsaved-gift"
    return { giftColumns: plan.giftColumns, pod: false, giftInFulfillment: false }
  }
  return "stop"
}

export function withStoredGift(fulfillmentData: Record<string, unknown>, gift: StoredGift): Record<string, unknown> {
  if (!gift.isGift) return fulfillmentData
  return { ...fulfillmentData, gift }
}

function giftFromFulfillment(fulfillmentData: unknown): StoredGift | null {
  if (!fulfillmentData || typeof fulfillmentData !== "object" || Array.isArray(fulfillmentData)) return null
  const gift = (fulfillmentData as { gift?: unknown }).gift
  if (!gift || typeof gift !== "object" || Array.isArray(gift)) return null
  const record = gift as Record<string, unknown>
  if (record.isGift !== true) return null
  const recipientName = cleanText(record.recipientName, GIFT_NAME_MAX)
  const giftMessage = typeof record.giftMessage === "string" ? cleanText(record.giftMessage, GIFT_MESSAGE_MAX) : null
  const email = typeof record.recipientEmail === "string" ? record.recipientEmail.trim() : ""
  return {
    isGift: true,
    recipientName,
    giftMessage,
    shipToRecipient: record.shipToRecipient === true,
    recipientEmail: email && validateEmail(email) ? email : null,
    delivery: record.delivery === "digital" ? "digital" : "shipped",
  }
}

export function readGift(order: GiftOrderRecord): StoredGift {
  const fromFulfillment = giftFromFulfillment(order.fulfillment_data)
  if (order.is_gift === true) {
    const shipToRecipient = order.gift_ship_to_recipient === true
    const addressKnown = "shipping_address_line1" in order
    const line1 = typeof order.shipping_address_line1 === "string" ? order.shipping_address_line1.trim() : ""
    const delivery =
      fromFulfillment?.delivery === "digital" || (addressKnown && !shipToRecipient && !line1) ? "digital" : "shipped"
    return {
      isGift: true,
      recipientName: cleanText(order.recipient_name, GIFT_NAME_MAX),
      giftMessage: cleanText(order.gift_message, GIFT_MESSAGE_MAX),
      shipToRecipient,
      recipientEmail: fromFulfillment?.recipientEmail ?? null,
      delivery,
    }
  }
  return fromFulfillment ?? NO_GIFT
}

/** Keeps a fallback gift object when fulfillment replaces fulfillment_data. */
export function preserveStoredGift(fulfillmentData: unknown): { gift: StoredGift } | Record<string, never> {
  const gift = giftFromFulfillment(fulfillmentData)
  if (!gift?.isGift) return {}
  return { gift }
}

/** Name printed on the carrier label. The buyer stays customer_name. */
export function packageRecipientName(order: GiftOrderRecord): string {
  const gift = readGift(order)
  if (gift.isGift && gift.shipToRecipient && gift.recipientName) return gift.recipientName
  const buyer = order.customer_name?.trim()
  return buyer || "Customer"
}

export function giftNoticeLines(order: GiftOrderRecord): string[] {
  const gift = readGift(order)
  if (!gift.isGift) return []
  const buyer = `Buyer: ${order.customer_name?.trim() || "not recorded"}`
  const recipient = `Recipient: ${gift.recipientName || "not recorded"}`
  if (gift.delivery === "digital") {
    return [
      "This order is a gift.",
      buyer,
      recipient,
      `Recipient email: ${gift.recipientEmail || "not recorded"}`,
      "Nothing is shipped. The buyer forwards the page link and QR code. Do not email the recipient.",
      `Gift note: ${gift.giftMessage || "None"}`,
    ]
  }
  return [
    "This order is a gift.",
    buyer,
    recipient,
    gift.shipToRecipient
      ? "Ship the package to the recipient at the shipping address on this order."
      : "Ship the package to the buyer at the shipping address on this order. They will give it to the recipient.",
    `Gift message: ${gift.giftMessage || "None"}`,
  ]
}

export function giftBuyerSentences(gift: StoredGift): string[] {
  if (!gift.isGift || !gift.recipientName) return []
  if (gift.delivery === "digital") {
    const where = gift.recipientEmail ? ` at ${gift.recipientEmail}` : ""
    const lines = [
      `This order is a gift for ${gift.recipientName}. Nothing is shipped. We email you the memorial page and QR code. Forward them to ${gift.recipientName}${where} when you are ready. We do not email the recipient.`,
    ]
    if (gift.giftMessage) lines.push(`Your note: ${gift.giftMessage}`)
    return lines
  }
  const shipping = gift.shipToRecipient
    ? `We will ship the keepsake to ${gift.recipientName} at the address you entered for them.`
    : `We will ship the keepsake to you, so you can give it to ${gift.recipientName}.`
  const lines = [`This order is a gift for ${gift.recipientName}. ${shipping}`]
  if (gift.giftMessage) lines.push(`Your message: ${gift.giftMessage}`)
  return lines
}
