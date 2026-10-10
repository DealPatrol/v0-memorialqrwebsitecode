import { test } from "node:test"
import assert from "node:assert/strict"
import { PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { priceCart } from "../lib/checkout-pricing"
import { getListedKeepsakes, getSellableKeepsakes, listSellableProducts } from "../lib/fulfillment-availability"
import { buyerIntentJsonLd, buyerIntentPages } from "../lib/buyer-intent"
import { parseWaitlistInput } from "../lib/plaque-waitlist"

const hidden = { KEEPSAKE_PLAQUES_ON_SALE: "false" }

test("both plaques are listed but not sellable", () => {
  const listed = getListedKeepsakes(hidden).map((p) => p.id)
  assert.ok(listed.includes(QR_MEMORIAL_PLAQUE_ID) && listed.includes(PET_MEMORIAL_PLAQUE_ID))
  const sellable = getSellableKeepsakes(hidden).map((p) => p.id)
  assert.equal(sellable.includes(QR_MEMORIAL_PLAQUE_ID), false)
  assert.equal(sellable.includes(PET_MEMORIAL_PLAQUE_ID), false)
  const api = listSellableProducts(hidden).map((p) => p.id)
  assert.equal(api.includes(QR_MEMORIAL_PLAQUE_ID), false)
  assert.ok(api.includes("concierge-digital"))
})

test("checkout pricing refuses a plaque but keeps concierge", () => {
  assert.equal(priceCart([{ id: QR_MEMORIAL_PLAQUE_ID, quantity: 1 }], hidden), null)
  assert.equal(priceCart([{ id: PET_MEMORIAL_PLAQUE_ID, quantity: 1 }], hidden), null)
  assert.ok(priceCart([{ id: "concierge-digital", quantity: 1 }], hidden))
})

test("guide schema drops the Product offer for a coming-soon plaque", () => {
  const product = getListedKeepsakes(hidden).find((p) => p.id === QR_MEMORIAL_PLAQUE_ID)!
  const data = buyerIntentJsonLd(buyerIntentPages.headstone, product)
  assert.deepEqual(data["@graph"].map((n: { "@type": string }) => n["@type"]), ["FAQPage"])
})

test("waitlist only accepts coming-soon keepsakes and valid emails", () => {
  assert.equal(parseWaitlistInput({ email: "A@Example.com ", productId: QR_MEMORIAL_PLAQUE_ID }, hidden).ok, true)
  assert.equal(parseWaitlistInput({ email: "nope", productId: QR_MEMORIAL_PLAQUE_ID }, hidden).ok, false)
  assert.equal(parseWaitlistInput({ email: "a@b.com", productId: "concierge-digital" }, hidden).ok, false)
})
