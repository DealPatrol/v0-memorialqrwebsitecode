import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { DIGITAL_MEMORIAL_ID } from "../lib/catalog"
import { priceCart } from "../lib/checkout-pricing"
import { resolveDigitalLanding } from "../lib/digital-landing-attribution"
import { buyerIntentList } from "../lib/buyer-intent"
import { digitalLandingList } from "../lib/digital-landing"
import { giftIntentList } from "../lib/gift-intent"
import {
  applyGiftDelivery,
  giftBuyerSentences,
  giftNoticeLines,
  giftOrderColumns,
  parseGiftOrder,
  readGift,
} from "../lib/gift-order"
import { longTailList } from "../lib/long-tail"
import { pageMetadata, publicPages } from "../lib/seo"
import {
  DIGITAL_GIFT_CHECKOUT_PATH,
  sympathyGiftJsonLd,
  sympathyGiftList,
} from "../lib/sympathy-gift-pages"

const servicePaths = [
  "/qr-code-for-funeral-program",
  "/celebration-of-life-qr-code",
  "/obituary-qr-code",
  "/memorial-service-slideshow-qr-code",
]

test("sympathy gift pages are distinct, indexable, and sell the digital memorial", () => {
  assert.equal(sympathyGiftList.length, 5)
  const paths = sympathyGiftList.map((page) => page.path)
  const titles = sympathyGiftList.map((page) => page.title)
  const descriptions = sympathyGiftList.map((page) => page.description)
  const headings = sympathyGiftList.map((page) => page.h1)
  const openings = sympathyGiftList.map((page) => page.paragraphs[0])
  for (const values of [paths, titles, descriptions, headings, openings]) {
    assert.equal(new Set(values).size, values.length)
  }

  const occupied = new Set([
    ...buyerIntentList.map((page) => page.path),
    ...giftIntentList.map((page) => page.path),
    ...longTailList.map((page) => page.path),
    ...digitalLandingList.map((page) => page.path),
    ...servicePaths,
  ])
  const sitemap = new Set(
    Object.values(publicPages)
      .filter((page) => page.index && page.inSitemap)
      .map((page) => page.path),
  )

  for (const page of sympathyGiftList) {
    assert.equal(occupied.has(page.path), false)
    assert.equal(sitemap.has(page.path), true)
    assert.equal(resolveDigitalLanding(null, page.path), page.path)
    assert.ok(page.paragraphs.length >= 3)
    assert.ok(page.steps.length >= 3)
    assert.ok(page.faqs.length >= 3)
    assert.ok(page.title.length <= 60)
    assert.ok(page.description.length <= 155)
    assert.equal(page.description.toLowerCase().includes("testimonial"), false)
    assert.equal(page.description.toLowerCase().includes("review"), false)
    assert.equal(page.paragraphs.join(" ").toLowerCase().includes("testimonial"), false)
    const joined = `${page.h1} ${page.paragraphs.join(" ")} ${page.faqs.map((faq) => faq.answer).join(" ")}`
    assert.match(joined, /gift/)
    assert.match(joined, /\$24\.99/)
    const metadata = pageMetadata(publicPages[pageKey(page.path)])
    assert.equal(metadata.alternates && "canonical" in metadata.alternates ? metadata.alternates.canonical : "", page.path)
    const data = sympathyGiftJsonLd(page)
    assert.equal(data["@graph"][0].sku, DIGITAL_MEMORIAL_ID)
    assert.equal(data["@graph"][0].offers.price, "24.99")
    assert.equal(data["@graph"][0].offers.priceCurrency, "USD")
    assert.equal("shippingDetails" in data["@graph"][0].offers, false)
    assert.equal("aggregateRating" in data["@graph"][0], false)
    assert.equal(data["@graph"][1]["@type"], "FAQPage")
    assert.equal(data["@graph"][1].mainEntity[0].name, page.faqs[0].question)
  }

  assert.equal(DIGITAL_GIFT_CHECKOUT_PATH, "/checkout/simple?product=digital-memorial&gift=1")
  const view = readFileSync(new URL("../components/sympathy-gift-view.tsx", import.meta.url), "utf8")
  assert.match(view, /DIGITAL_GIFT_CHECKOUT_PATH/)
  assert.match(view, /Buy the digital memorial as a gift/)
  assert.match(view, /landingPath=\{page\.path\}/)
  assert.match(view, /TrackViewContent/)
  const checkout = readFileSync(new URL("../app/checkout/simple/page.tsx", import.meta.url), "utf8")
  assert.match(checkout, /recipientEmail/)
  assert.match(checkout, /digitalGiftEligible/)
  assert.match(checkout, /searchParams\.get\("gift"\) !== "1"/)
})

test("a digital gift records the recipient without changing the price", () => {
  const parsed = parseGiftOrder({
    isGift: true,
    recipientName: " Ada Lovelace ",
    giftMessage: "  With care from the team. ",
    shipToRecipient: true,
    recipientEmail: " ada@example.com ",
  })
  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  const applied = applyGiftDelivery(parsed.gift, false)
  assert.equal(applied.ok, true)
  if (!applied.ok) return
  assert.equal(applied.gift.delivery, "digital")
  assert.equal(applied.gift.shipToRecipient, false)
  assert.equal(applied.gift.recipientName, "Ada Lovelace")
  assert.equal(applied.gift.recipientEmail, "ada@example.com")
  assert.equal(applied.gift.giftMessage, "With care from the team.")
  const columns = giftOrderColumns(applied.gift)
  assert.equal(columns?.is_gift, true)
  assert.equal(columns && "recipient_email" in columns, false)
  assert.equal(columns && "price" in columns, false)

  const stored = readGift({
    customer_name: "Grace Hopper",
    is_gift: true,
    recipient_name: "Ada Lovelace",
    gift_message: "With care from the team.",
    gift_ship_to_recipient: false,
    fulfillment_data: { gift: applied.gift },
  })
  assert.equal(stored.recipientEmail, "ada@example.com")
  assert.equal(stored.delivery, "digital")
  const buyer = giftBuyerSentences(stored).join("\n")
  assert.match(buyer, /Nothing is shipped/)
  assert.match(buyer, /ada@example.com/)
  assert.match(buyer, /We do not email the recipient/)
  assert.equal(buyer.includes("ship the keepsake"), false)
  const notice = giftNoticeLines({
    customer_name: "Grace Hopper",
    is_gift: true,
    recipient_name: "Ada Lovelace",
    gift_message: "With care from the team.",
    fulfillment_data: { gift: applied.gift },
  }).join("\n")
  assert.match(notice, /Recipient email: ada@example.com/)
  assert.match(notice, /Nothing is shipped/)
  assert.equal(notice.includes("Ship the package"), false)
  const inferred = readGift({
    is_gift: true,
    recipient_name: "Ada Lovelace",
    gift_message: "With care",
    gift_ship_to_recipient: false,
    shipping_address_line1: "",
  })
  assert.equal(inferred.delivery, "digital")
  assert.equal(giftNoticeLines({ ...inferred, is_gift: true, recipient_name: "Ada Lovelace", shipping_address_line1: "" }).join("\n").includes("Ship the package"), false)

  const cart = priceCart([{ id: DIGITAL_MEMORIAL_ID, quantity: 1, price: 0.01 }], {})
  assert.ok(cart)
  assert.equal(cart.amountCents, 2499)

  assert.equal(applyGiftDelivery(parsed.gift, false).ok, true)
  const missingEmail = parseGiftOrder({
    isGift: true,
    recipientName: "Ada",
    giftMessage: "",
    shipToRecipient: false,
  })
  assert.equal(missingEmail.ok, true)
  if (!missingEmail.ok) return
  assert.equal(applyGiftDelivery(missingEmail.gift, false).ok, false)
  assert.equal(applyGiftDelivery(missingEmail.gift, true).ok, true)
  assert.equal(parseGiftOrder({ isGift: true, recipientName: "Ada", recipientEmail: "not-an-email", shipToRecipient: false }).ok, false)
})

function pageKey(path: string): keyof typeof publicPages {
  const match = Object.entries(publicPages).find(([, page]) => page.path === path)
  if (!match) throw new Error(`Missing public page for ${path}`)
  return match[0] as keyof typeof publicPages
}
