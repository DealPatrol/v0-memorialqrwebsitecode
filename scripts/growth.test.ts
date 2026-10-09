import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buyerIntentJsonLd, buyerIntentList, PRIMARY_KEEPSAKE_ID } from "../lib/buyer-intent"
import { giftIntentList } from "../lib/gift-intent"
import { getSellableKeepsake } from "../lib/fulfillment-availability"
import { buildMerchantFeedXml } from "../lib/merchant-feed"
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
    assert.match(feed, /<g:price>0\.00 USD<\/g:price>/)
    assert.equal(feed.includes("<g:gtin>"), false)
    assert.equal(ld.sku, "qr-memorial-plaque")
    assert.equal(ld.offers.price, "29.99")
    assert.equal(ld.offers.availability, "https://schema.org/InStock")
    assert.equal(ld.offers.shippingDetails.shippingRate.value, "0.00")
    assert.equal(ld.offers.shippingDetails.deliveryTime.handlingTime.minValue, 7)
    assert.equal(ld.offers.shippingDetails.deliveryTime.handlingTime.maxValue, 10)
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
  })
})

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
