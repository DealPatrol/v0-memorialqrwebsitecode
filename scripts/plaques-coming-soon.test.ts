import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { DIGITAL_MEMORIAL_ID, getCheckoutProduct, PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { digitalMemorialJsonLd } from "../lib/digital-memorial"
import { priceCart } from "../lib/checkout-pricing"
import {
  getListedKeepsakes,
  getSellableKeepsakes,
  listSellableProducts,
  resolveConfiguredCheckoutItems,
} from "../lib/fulfillment-availability"
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

test("digital memorial checks out without print partners and publishes one offer", () => {
  const product = getCheckoutProduct(DIGITAL_MEMORIAL_ID)
  assert.ok(product)
  assert.equal(product.price, 24.99)
  assert.ok(product.price >= 19 && product.price <= 49)
  const cart = priceCart([{ id: DIGITAL_MEMORIAL_ID, quantity: 1, price: 0.01 }], hidden)
  assert.ok(cart)
  assert.equal(cart.amountCents, 2499)
  assert.equal(cart.currency, "USD")
  const lines = resolveConfiguredCheckoutItems([{ id: DIGITAL_MEMORIAL_ID, quantity: 1 }], {})
  assert.ok(lines)
  assert.equal(lines[0].ships, false)
  assert.equal(lines[0].provider, null)
  assert.equal(lines[0].syncVariantId, null)
  const sellable = listSellableProducts(hidden).find((item) => item.id === DIGITAL_MEMORIAL_ID)
  assert.ok(sellable)
  assert.equal(sellable.ships, false)
  assert.equal(getSellableKeepsakes(hidden).some((item) => item.id === DIGITAL_MEMORIAL_ID), false)

  const ld = digitalMemorialJsonLd()
  assert.equal(ld["@type"], "Product")
  assert.equal(Array.isArray(ld.offers), false)
  assert.equal(ld.offers["@type"], "Offer")
  assert.equal(ld.offers.price, "24.99")
  assert.equal(ld.offers.priceCurrency, "USD")
  assert.equal(ld.offers.url, "https://memorialsqr.com/digital-memorial")
  assert.equal("shippingDetails" in ld.offers, false)
  assert.equal("aggregateRating" in ld, false)
  assert.equal(publicPages.digitalMemorial.path, "/digital-memorial")
  assert.equal(publicPages.digitalMemorial.inSitemap, true)
  assert.equal(publicPages.digitalMemorial.index, true)
  assert.ok(publicPages.digitalMemorial.title.length <= 60)
  assert.ok(publicPages.digitalMemorial.description.length >= 120)
  assert.ok(publicPages.digitalMemorial.description.length <= 155)
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
  assert.equal(noneTypes.includes("ItemList"), true)
  assert.equal(noneTypes.includes("FAQPage"), true)
  assert.equal(JSON.stringify(none).includes(QR_MEMORIAL_PLAQUE_ID), false)
  assert.equal(JSON.stringify(none).includes(PET_MEMORIAL_PLAQUE_ID), false)
  const noneList = none["@graph"].find((node: { "@type": string }) => node["@type"] === "ItemList") as {
    numberOfItems: number
    itemListElement: { item: { sku: string; offers: { price: string } } }[]
  }
  assert.equal(noneList.numberOfItems, 1)
  assert.equal(noneList.itemListElement[0].item.sku, DIGITAL_MEMORIAL_ID)
  assert.equal(noneList.itemListElement[0].item.offers.price, "24.99")
  assert.equal("shippingDetails" in noneList.itemListElement[0].item.offers, false)

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
  assert.equal(list.numberOfItems, 2)
  assert.equal(list.itemListElement[0].item.sku, DIGITAL_MEMORIAL_ID)
  assert.equal(list.itemListElement[0].item.offers.price, "24.99")
  assert.equal(list.itemListElement[1].item.sku, "keep-card")
  assert.equal(list.itemListElement[1].item.offers.price, "39.99")
  assert.equal(JSON.stringify(data).includes(QR_MEMORIAL_PLAQUE_ID), false)

  const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
  assert.match(home, /Shop Keepsakes/)
  assert.match(home, /Join the list/)
  assert.match(home, /Have Us Build It/)
  assert.match(home, /KEEPSAKE_COLLECTION_PATH/)
  assert.match(home, /DIGITAL_MEMORIAL_PATH/)
  assert.match(home, /Order a Digital Memorial/)
  assert.match(home, /#plaque-waitlist/)
  assert.equal(home.includes("Buy the QR Memorial Plaque"), false)
  assert.equal(home.includes("Buy the Pet Memorial QR Plaque"), false)
})
