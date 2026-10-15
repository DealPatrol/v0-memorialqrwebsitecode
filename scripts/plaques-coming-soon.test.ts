import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { priceCart } from "../lib/checkout-pricing"
import { getListedKeepsakes, getSellableKeepsakes, listSellableProducts } from "../lib/fulfillment-availability"
import { buyerIntentJsonLd, buyerIntentPages } from "../lib/buyer-intent"
import { keepsakeCollectionJsonLd, keepsakesForCollection } from "../lib/keepsake-collection"
import { parseWaitlistInput, waitlistEmailError } from "../lib/plaque-waitlist"
import { publicPages } from "../lib/seo"

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
  assert.equal(waitlistEmailError("nope"), "Enter a valid email address")
  assert.equal(waitlistEmailError("A@Example.com "), null)
  assert.equal(parseWaitlistInput({ email: "a@b.com", productId: "concierge-digital" }, hidden).ok, false)
})

test("order page lists sellable keepsakes and leaves plaques out of the offer list", () => {
  assert.equal(publicPages.keepsakes.path, "/keepsakes")
  assert.equal(publicPages.keepsakes.inSitemap, true)
  assert.ok(publicPages.keepsakes.title.length <= 60)
  assert.ok(publicPages.keepsakes.description.length <= 155)

  const none = keepsakeCollectionJsonLd(keepsakesForCollection(hidden))
  const noneTypes = none["@graph"].map((node: { "@type": string }) => node["@type"])
  assert.equal(noneTypes.includes("ItemList"), false)
  assert.equal(noneTypes.includes("FAQPage"), true)
  assert.equal(JSON.stringify(none).includes(QR_MEMORIAL_PLAQUE_ID), false)
  assert.equal(JSON.stringify(none).includes(PET_MEMORIAL_PLAQUE_ID), false)

  const ready = {
    ...hidden,
    PRINTFUL_API_TOKEN: "printful-token",
    PRINTFUL_KEEP_CARD_TEMPLATE_ID: "1001",
  }
  const products = keepsakesForCollection(ready)
  assert.deepEqual(products.map((product) => product.id), ["keep-card"])
  const data = keepsakeCollectionJsonLd(products)
  const list = data["@graph"].find((node: { "@type": string }) => node["@type"] === "ItemList") as {
    numberOfItems: number
    itemListElement: { item: { sku: string; offers: { price: string } } }[]
  }
  assert.equal(list.numberOfItems, 1)
  assert.equal(list.itemListElement[0].item.sku, "keep-card")
  assert.equal(list.itemListElement[0].item.offers.price, "39.99")
  assert.equal(JSON.stringify(data).includes(QR_MEMORIAL_PLAQUE_ID), false)

  const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
  assert.match(home, /Shop Keepsakes/)
  assert.match(home, /Join the list/)
  assert.match(home, /Have Us Build It/)
  assert.match(home, /KEEPSAKE_COLLECTION_PATH/)
  assert.match(home, /#plaque-waitlist/)
  assert.equal(home.includes("Buy the QR Memorial Plaque"), false)
  assert.equal(home.includes("Buy the Pet Memorial QR Plaque"), false)
})
