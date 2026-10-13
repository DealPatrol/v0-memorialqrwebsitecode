import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { describe, it } from "node:test"
import { buyerIntentJsonLd, buyerIntentList, PRIMARY_KEEPSAKE_ID } from "../lib/buyer-intent"
import { giftIntentList } from "../lib/gift-intent"
import { getSellableKeepsakes, getSellableKeepsake } from "../lib/fulfillment-availability"
import { POD_PRODUCTS, PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { STORE_CATALOG } from "../lib/store-catalog"
import { priceCart } from "../lib/checkout-pricing"
import { buildMerchantFeedXml, catalogIdsMissingGoogleCategory } from "../lib/merchant-feed"
import { formatUsd, SITE_NAME } from "../lib/site"
import { keepsakeFaqJsonLd, keepsakeFaqs } from "../lib/keepsake-faq"
import { keepsakePageCopy } from "../lib/keepsake-page"
import { keepsakeProductJsonLd } from "../lib/keepsake-jsonld"
import { buildGuideEmail, MEMORIAL_GUIDE_SECTIONS, parseGuideEmail } from "../lib/memorial-guide"
import { parseReviewSubmission, reviewStructuredData } from "../lib/product-reviews"
import { buildReviewRequestEmail, productIdFromOrder, reviewRequestDecision } from "../lib/review-request"
import { publicPages } from "../lib/seo"

describe("gift intent pages", () => {
  it("gives each gift a unique path, heading, and sitemap entry", () => {
    const paths = giftIntentList.map((page) => page.path)
    assert.equal(new Set(paths).size, paths.length)
    const headings = giftIntentList.map((page) => page.h1)
    assert.equal(new Set(headings).size, headings.length)
    const buyerPaths = new Set(buyerIntentList.map((page) => page.path))

    const sitemapPaths = new Set(
      Object.values(publicPages)
        .filter((page) => page.inSitemap)
        .map((page) => page.path),
    )
    for (const page of giftIntentList) {
      assert.equal(sitemapPaths.has(page.path), true)
      assert.equal(buyerPaths.has(page.path), false)
      assert.ok(page.faqs.length >= 3)
      assert.ok(page.paragraphs.length >= 3)
      assert.equal(new Set(page.paragraphs).size, page.paragraphs.length)
    }
  })

  it("points the gift schema at the plaque people can buy", () => {
    const product = getSellableKeepsake(PRIMARY_KEEPSAKE_ID, {})
    assert.ok(product)
    const data = buyerIntentJsonLd(giftIntentList[0], product)
    assert.equal(data["@graph"][0].offers.price, "29.99")
    assert.equal(data["@graph"][1].mainEntity[0].acceptedAnswer.text, giftIntentList[0].faqs[0].answer)
  })
})

describe("merchant feed", () => {
  it("lists the plaque with price, shipping, availability, and no GTIN", () => {
    const product = getSellableKeepsake(PRIMARY_KEEPSAKE_ID, {})
    assert.ok(product)
    const feed = buildMerchantFeedXml()
    const ld = keepsakeProductJsonLd(product)
    assert.match(feed, /<g:id>qr-memorial-plaque<\/g:id>/)
    assert.match(feed, /<g:id>pet-memorial-plaque<\/g:id>/)
    assert.match(feed, /<g:link>https:\/\/memorialsqr.com\/store\/pet-memorial-plaque<\/g:link>/)
    assert.equal(feed.match(/<g:price>29\.99 USD<\/g:price>/g)?.length, 2)
    assert.match(feed, /<g:price>29\.99 USD<\/g:price>/)
    assert.match(feed, /<g:availability>in_stock<\/g:availability>/)
    assert.match(feed, /<g:identifier_exists>no<\/g:identifier_exists>/)
    assert.match(feed, /<g:brand>MemorialsQR<\/g:brand>/)
    assert.match(feed, /<g:condition>new<\/g:condition>/)
    assert.match(feed, /<g:google_product_category>Home &amp; Garden &gt; Decor &gt; Decorative Plaques<\/g:google_product_category>/)
    assert.match(feed, /<g:price>0\.00 USD<\/g:price>/)
    assert.match(feed, /<g:min_handling_time>7<\/g:min_handling_time>/)
    assert.match(feed, /<g:max_handling_time>10<\/g:max_handling_time>/)
    assert.equal(feed.includes("<g:gtin>"), false)
    assert.equal(feed.includes("299.99"), false)
    assert.equal(ld.sku, "qr-memorial-plaque")
    assert.equal(ld.offers.price, "29.99")
    assert.equal(ld.offers.priceCurrency, "USD")
    assert.equal(ld.offers.availability, "https://schema.org/InStock")
    assert.equal(ld.offers.seller.name, SITE_NAME)
    assert.equal(ld.offers.seller["@type"], "Organization")
    assert.equal(ld.offers.shippingDetails.shippingRate.value, "0.00")
    const handling = ld.offers.shippingDetails.deliveryTime
    assert.ok(handling)
    assert.equal(handling.handlingTime.minValue, 7)
    assert.equal(handling.handlingTime.maxValue, 10)
    assert.equal(ld.offers.hasMerchantReturnPolicy.merchantReturnDays, 30)
    assert.equal(ld.offers.hasMerchantReturnPolicy.applicableCountry, "US")
    assert.equal("returnFees" in ld.offers.hasMerchantReturnPolicy, false)
    assert.equal("aggregateRating" in ld, false)
    assert.equal("gtin" in ld, false)
    const pet = getSellableKeepsake("pet-memorial-plaque", {})
    assert.ok(pet)
    const petLd = keepsakeProductJsonLd(pet)
    assert.equal(petLd.offers.price, "29.99")
    assert.equal(petLd.offers.url, "https://memorialsqr.com/store/pet-memorial-plaque")
    const petCopy = keepsakePageCopy(pet)
    assert.ok(petCopy.title.length <= 60)
    assert.ok(petCopy.description.length <= 155)
    assert.equal(petCopy.path, "/store/pet-memorial-plaque")
    const plaqueCopy = keepsakePageCopy(product)
    assert.ok(plaqueCopy.description.length <= 155)
    assert.equal(plaqueCopy.path, "/store/qr-memorial-plaque")
    const faqs = keepsakeFaqs("qr-memorial-plaque")
    assert.equal(faqs.length, 4)
    assert.match(faqs[0].answer, /7 to 10 business days/)
    assert.match(faqs[2].answer, /10 years/)
    assert.match(faqs[3].answer, /30-day money-back guarantee/)
    assert.match(faqs[3].answer, /support@memorialsqr.com/)
    assert.equal(keepsakeFaqs("pet-memorial-plaque").length, 4)
    assert.equal(keepsakeFaqJsonLd(faqs)["@type"], "FAQPage")
    assert.equal(feed.includes("#1"), false)
    assert.equal(formatUsd(product.price), "$29.99 USD")
    assertWellFormedFeed(feed)
  })

  it("lists plaques, the store catalog, and configured print products at the checkout price", () => {
    assert.deepEqual(catalogIdsMissingGoogleCategory(), [])
    const hidden = {
      KEEPSAKE_PLAQUES_ON_SALE: "false",
      PRINTFUL_API_TOKEN: "printful-token",
      PRINTFUL_KEEP_CARD_TEMPLATE_ID: "1001",
      PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID: "1002",
      PRINTIFY_API_TOKEN: "printify-token",
      PRINTIFY_SHOP_ID: "42",
      PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID: "prod-keyring",
      PRINTIFY_ACRYLIC_KEYRING_VARIANT_ID: "501",
      PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID: "prod-voice",
      PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID: "502",
      PRINTIFY_SLATE_PLAQUE_PRODUCT_ID: "prod-slate",
      PRINTIFY_SLATE_PLAQUE_VARIANT_ID: "503",
      PRINTIFY_PET_TAG_PRODUCT_ID: "prod-pet",
      PRINTIFY_PET_TAG_VARIANT_ID: "504",
      PRINTIFY_PHOTO_BLOCK_PRODUCT_ID: "prod-block",
      PRINTIFY_PHOTO_BLOCK_VARIANT_ID: "505",
    }
    const products = getSellableKeepsakes(hidden)
    const ids = products.map((product) => product.id)
    assert.ok(ids.includes(QR_MEMORIAL_PLAQUE_ID))
    assert.ok(ids.includes(PET_MEMORIAL_PLAQUE_ID))
    for (const product of POD_PRODUCTS) assert.ok(ids.includes(product.id))
    for (const product of STORE_CATALOG) assert.ok(ids.includes(product.id))
    const feed = buildMerchantFeedXml(hidden)
    assert.match(feed, /<g:id>qr-memorial-plaque<\/g:id>/)
    assert.match(feed, /<g:id>human-photo-canvas<\/g:id>/)
    assert.match(feed, /<g:id>human-garden-stone-1<\/g:id>/)
    assert.equal(feed.includes("concierge"), false)
    assert.equal(feed.includes("<g:gtin>"), false)
    assertWellFormedFeed(feed)
    const parsed = parseFeedItems(feed)
    assert.equal(parsed.length, products.length)

    for (const product of products) {
      const item = parsed.find((row) => row.id === product.id)
      assert.ok(item)
      const priced = priceCart([{ id: product.id, quantity: 1 }], hidden)
      assert.ok(priced)
      assert.equal(item.price, `${product.price.toFixed(2)} USD`)
      assert.equal(priced.amountCents, Math.round(product.price * 100))
      assert.equal(item.price, `${(priced.amountCents / 100).toFixed(2)} USD`)
      assert.equal(item.availability, "in_stock")
      assert.equal(item.condition, "new")
      assert.equal(item.brand, "MemorialsQR")
      assert.equal(item.identifierExists, "no")
      assert.equal(item.link, `https://memorialsqr.com/store/${product.id}`)
      assert.equal(item.image.startsWith("https://memorialsqr.com/"), true)
      assert.equal(item.shippingCountry, "US")
      assert.equal(item.shippingPrice, "0.00 USD")
      assert.ok(item.category.length > 0)
      const handmade = product.provider === "manual" || product.provider === "merchize"
      assert.equal(item.handlingMin, handmade ? "7" : "")
      const ld = keepsakeProductJsonLd(product)
      assertProductOffer(ld, product.price)
      if (handmade) {
        assert.equal(ld.offers.shippingDetails.deliveryTime?.handlingTime.minValue, 7)
      } else {
        assert.equal(ld.offers.shippingDetails.deliveryTime, undefined)
      }
      assert.equal(formatUsd(product.price).includes(ld.offers.price), true)
    }

    const none = buildMerchantFeedXml({ KEEPSAKE_PLAQUES_ON_SALE: "false" })
    assert.match(none, /<g:id>qr-memorial-plaque<\/g:id>/)
    assert.match(none, /<g:id>human-wind-chime<\/g:id>/)
    assert.equal(none.includes("keep-card"), false)
    assert.equal(none.includes("concierge"), false)
    assertWellFormedFeed(none)
  })
})

function assertWellFormedFeed(xml: string) {
  const result = spawnSync("python3", ["-c", "import sys, xml.etree.ElementTree as ET; ET.fromstring(sys.stdin.read())"], {
    input: xml,
    encoding: "utf8",
  })
  assert.equal(result.status, 0, result.stderr)
}

function parseFeedItems(xml: string) {
  const script = `
import json, sys, xml.etree.ElementTree as ET
ns = {"g": "http://base.google.com/ns/1.0"}
root = ET.fromstring(sys.stdin.read())
rows = []
for item in root.findall("./channel/item"):
    def text(path):
        node = item.find(path, ns)
        return "" if node is None or node.text is None else node.text
    rows.append({
        "id": text("g:id"),
        "price": text("g:price"),
        "availability": text("g:availability"),
        "condition": text("g:condition"),
        "brand": text("g:brand"),
        "identifierExists": text("g:identifier_exists"),
        "link": text("g:link"),
        "image": text("g:image_link"),
        "category": text("g:google_product_category"),
        "shippingCountry": text("g:shipping/g:country"),
        "shippingPrice": text("g:shipping/g:price"),
        "handlingMin": text("g:min_handling_time"),
        "gtin": text("g:gtin"),
    })
print(json.dumps(rows))
`
  const result = spawnSync("python3", ["-c", script], { input: xml, encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout) as Array<{
    id: string
    price: string
    availability: string
    condition: string
    brand: string
    identifierExists: string
    link: string
    image: string
    category: string
    shippingCountry: string
    shippingPrice: string
    handlingMin: string
    gtin: string
  }>
}

function assertProductOffer(data: ReturnType<typeof keepsakeProductJsonLd>, price: number) {
  assert.equal(data["@context"], "https://schema.org")
  assert.equal(data["@type"], "Product")
  assert.equal(typeof data.name, "string")
  assert.ok(data.name.length > 0)
  assert.ok(data.description.length > 0)
  assert.equal(data.image.startsWith("https://"), true)
  assert.equal(data.brand["@type"], "Brand")
  assert.equal(data.brand.name, "MemorialsQR")
  assert.equal(data.offers["@type"], "Offer")
  assert.equal(data.offers.price, price.toFixed(2))
  assert.equal(data.offers.priceCurrency, "USD")
  assert.equal(data.offers.availability, "https://schema.org/InStock")
  assert.equal(data.offers.itemCondition, "https://schema.org/NewCondition")
  assert.equal(data.offers.url.startsWith("https://memorialsqr.com/store/"), true)
  assert.equal(data.offers.seller["@type"], "Organization")
  assert.equal(data.offers.seller.name, "MemorialsQR")
  assert.equal(data.offers.shippingDetails["@type"], "OfferShippingDetails")
  assert.equal(data.offers.shippingDetails.shippingRate.value, "0.00")
  assert.equal(data.offers.shippingDetails.shippingRate.currency, "USD")
  assert.equal(data.offers.shippingDetails.shippingDestination.addressCountry, "US")
  assert.equal(data.offers.hasMerchantReturnPolicy["@type"], "MerchantReturnPolicy")
  assert.equal(data.offers.hasMerchantReturnPolicy.returnPolicyCategory, "https://schema.org/MerchantReturnFiniteReturnWindow")
  assert.equal(data.offers.hasMerchantReturnPolicy.merchantReturnDays, 30)
  assert.equal(data.offers.hasMerchantReturnPolicy.merchantReturnLink, "https://memorialsqr.com/terms-of-service")
  assert.equal("aggregateRating" in data, false)
  assert.equal("review" in data, false)
  assert.equal("gtin" in data, false)
}

describe("reviews", () => {
  it("asks for a review only after fulfillment and never invents ratings", () => {
    assert.equal(
      reviewRequestDecision({
        status: "processing",
        fulfillmentStatus: "manual",
        sentAt: null,
        customerEmail: "ada@example.com",
        productId: "qr-memorial-plaque",
      }),
      "wait",
    )
    assert.equal(
      reviewRequestDecision({
        status: "completed",
        fulfillmentStatus: "manual",
        sentAt: null,
        customerEmail: "ada@example.com",
        productId: "qr-memorial-plaque",
      }),
      "send",
    )
    assert.equal(
      reviewRequestDecision({
        status: "completed",
        fulfillmentStatus: "manual",
        sentAt: "2026-10-08T00:00:00.000Z",
        customerEmail: "ada@example.com",
        productId: "qr-memorial-plaque",
      }),
      "skip",
    )
    assert.equal(productIdFromOrder({ product_name: "QR Memorial Plaque", line_items: [{ sku: "qr-memorial-plaque" }] }, {}), "qr-memorial-plaque")
    assert.equal(productIdFromOrder({ product_name: "Concierge Service - Digital Link" }, {}), null)
    const email = buildReviewRequestEmail({
      customerName: "Ada",
      productName: "QR Memorial Plaque",
      reviewUrl: "https://memorialsqr.com/review?token=abc",
    })
    assert.match(email.text, /no discount/)
    assert.match(email.text, /review\?token=abc/)
    assert.equal(reviewStructuredData([]), null)
    assert.equal(parseReviewSubmission({ token: "not-a-token", rating: 5, body: "This plaque has been a comfort." }).ok, false)
  })
})

describe("memorial guide", () => {
  it("rejects a bad address and emails the guide itself", () => {
    assert.equal(parseGuideEmail({ email: "not-an-email" }).ok, false)
    const parsed = parseGuideEmail({ email: "ada@example.com" })
    assert.equal(parsed.ok, true)
    if (!parsed.ok) return
    const email = buildGuideEmail(parsed.email)
    assert.match(email.subject, /meaningful memorial page/)
    assert.match(email.text, new RegExp(MEMORIAL_GUIDE_SECTIONS[0].heading))
    assert.match(email.text, /not a series of emails/)
  })
})
