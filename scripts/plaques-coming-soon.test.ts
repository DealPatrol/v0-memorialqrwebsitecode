import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { DIGITAL_MEMORIAL_ID, getCheckoutProduct, PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { digitalLandingJsonLd, digitalLandingList, serviceLandingList } from "../lib/digital-landing"
import { resolveDigitalLanding } from "../lib/digital-landing-attribution"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH, digitalMemorialJsonLd, digitalMemorialPolicyFaqs } from "../lib/digital-memorial"
import { EXAMPLE_MEMORIAL_PATH } from "../lib/example-memorial"
import { priceCart } from "../lib/checkout-pricing"
import {
  getListedKeepsakes,
  getSellableKeepsakes,
  listSellableProducts,
  resolveConfiguredCheckoutItems,
} from "../lib/fulfillment-availability"
import { buyerIntentJsonLd, buyerIntentList, buyerIntentPages } from "../lib/buyer-intent"
import { giftIntentList } from "../lib/gift-intent"
import { longTailList } from "../lib/long-tail"
import { keepsakeCollectionJsonLd, keepsakesForCollection } from "../lib/keepsake-collection"
import { parseWaitlistInput, waitlistEmailError } from "../lib/plaque-waitlist"
import { pageMetadata, publicPages } from "../lib/seo"

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
  assert.equal(ld.offers.hasMerchantReturnPolicy.merchantReturnDays, 30)
  assert.equal("aggregateRating" in ld, false)
  assert.ok(digitalMemorialPolicyFaqs().some((faq) => faq.question === "What is the refund policy?"))
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
  assert.match(home, /DIGITAL_MEMORIAL_CHECKOUT_PATH/)
})

test("digital memorial landing pages are indexable and sell the page", () => {
  assert.equal(digitalLandingList.length, 10)
  assert.equal(serviceLandingList.length, 4)
  const occupied = new Set([
    ...buyerIntentList.map((page) => page.path),
    ...giftIntentList.map((page) => page.path),
    ...longTailList.map((page) => page.path),
  ])
  const sitemap = new Set(
    Object.values(publicPages)
      .filter((page) => page.index && page.inSitemap)
      .map((page) => page.path),
  )
  const titles = digitalLandingList.map((page) => page.title)
  const descriptions = digitalLandingList.map((page) => page.description)
  assert.equal(new Set(digitalLandingList.map((page) => page.path)).size, digitalLandingList.length)
  assert.equal(new Set(titles).size, titles.length)
  assert.equal(new Set(descriptions).size, descriptions.length)

  const openings = digitalLandingList.map((page) => page.paragraphs[0])
  assert.equal(new Set(openings).size, openings.length)

  for (const page of digitalLandingList) {
    assert.equal(occupied.has(page.path), false)
    assert.equal(sitemap.has(page.path), true)
    assert.equal(resolveDigitalLanding(null, page.path), page.path)
    assert.equal(publicPages[pageKey(page.path)]?.index, true)
    assert.ok(page.paragraphs.length >= 3)
    assert.ok(page.steps.length >= 3)
    assert.ok(page.faqs.length >= 3)
    assert.ok(page.title.length <= 60)
    assert.ok(page.description.length <= 155)
    const data = digitalLandingJsonLd(page)
    assert.equal(data["@graph"][0]["@type"], "Product")
    assert.equal(data["@graph"][0].sku, DIGITAL_MEMORIAL_ID)
    assert.equal(data["@graph"][0].offers.price, "24.99")
    assert.equal(data["@graph"][0].offers.priceCurrency, "USD")
    assert.equal("shippingDetails" in data["@graph"][0].offers, false)
    assert.equal(data["@graph"][0].offers.hasMerchantReturnPolicy.merchantReturnDays, 30)
    assert.equal(data["@graph"][1]["@type"], "FAQPage")
    assert.equal(data["@graph"][1].mainEntity[0].name, page.faqs[0].question)
    const questions = data["@graph"][1].mainEntity.map((item: { name: string }) => item.name)
    assert.ok(questions.includes("What is the refund policy?"))
  }

  assert.equal(publicPages.exampleMemorial.path, EXAMPLE_MEMORIAL_PATH)
  assert.equal(publicPages.exampleMemorial.inSitemap, true)
  assert.equal(publicPages.exampleMemorial.index, true)
  const exampleMeta = pageMetadata(publicPages.exampleMemorial)
  assert.equal(
    exampleMeta.alternates && "canonical" in exampleMeta.alternates ? exampleMeta.alternates.canonical : "",
    EXAMPLE_MEMORIAL_PATH,
  )
  const example = readFileSync(new URL("../app/example-memorial/page.tsx", import.meta.url), "utf8")
  assert.match(example, /EXAMPLE_MEMORIAL_NOTICE/)
  assert.match(example, /DIGITAL_MEMORIAL_CHECKOUT_PATH/)
  assert.equal(example.toLowerCase().includes("glenda"), false)
  assert.equal(example.toLowerCase().includes("testimonial"), false)

  const view = readFileSync(new URL("../components/digital-landing-view.tsx", import.meta.url), "utf8")
  assert.match(view, /DIGITAL_MEMORIAL_CHECKOUT_PATH/)
  assert.match(view, /Buy the digital memorial/)
  assert.match(view, /How it works/)
  assert.match(view, /TrackViewContent/)
  assert.match(view, /EXAMPLE_MEMORIAL_PATH/)
  assert.match(view, /landingPath=\{page\.path\}/)
  const keepsakes = readFileSync(new URL("../app/keepsakes/page.tsx", import.meta.url), "utf8")
  assert.match(keepsakes, /DIGITAL_MEMORIAL_CHECKOUT_PATH/)
  assert.match(keepsakes, /digitalLandingList/)
  assert.match(keepsakes, /serviceLandingList/)
  const homeSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
  assert.match(homeSource, /serviceLandingList/)
  const productPage = readFileSync(new URL("../app/digital-memorial/page.tsx", import.meta.url), "utf8")
  assert.match(productPage, /serviceLandingList/)
  assert.equal(DIGITAL_MEMORIAL_CHECKOUT_PATH, "/checkout/simple?product=digital-memorial")

  const servicePaths = [
    "/qr-code-for-funeral-program",
    "/celebration-of-life-qr-code",
    "/obituary-qr-code",
    "/memorial-service-slideshow-qr-code",
  ]
  assert.deepEqual(
    serviceLandingList.map((page) => page.path),
    servicePaths,
  )
  for (const path of servicePaths) {
    assert.equal(resolveDigitalLanding(path, "/checkout/simple"), path)
    const page = serviceLandingList.find((item) => item.path === path)
    assert.ok(page)
    assert.match(page.description, /\$24\.99 USD/)
    assert.equal(page.description.toLowerCase().includes("testimonial"), false)
    assert.equal(page.paragraphs.join(" ").toLowerCase().includes("partner funeral"), false)
  }
})

function pageKey(path: string): keyof typeof publicPages {
  const match = Object.entries(publicPages).find(([, page]) => page.path === path)
  if (!match) throw new Error(`Missing public page for ${path}`)
  return match[0] as keyof typeof publicPages
}
