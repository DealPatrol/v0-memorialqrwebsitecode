import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buyerIntentJsonLd, buyerIntentList, PRIMARY_KEEPSAKE_ID } from "../lib/buyer-intent"
import { getSellableKeepsake } from "../lib/fulfillment-availability"
import { buildPartnerInquiryEmail, parsePartnerInquiry } from "../lib/partner-inquiry"
import { publicPages } from "../lib/seo"

describe("buyer intent pages", () => {
  it("gives each guide a unique path, heading, and sitemap entry", () => {
    const paths = buyerIntentList.map((page) => page.path)
    assert.equal(new Set(paths).size, paths.length)
    const headings = buyerIntentList.map((page) => page.h1)
    assert.equal(new Set(headings).size, headings.length)

    const sitemapPaths = new Set(
      Object.values(publicPages)
        .filter((page) => page.inSitemap)
        .map((page) => page.path),
    )
    for (const page of buyerIntentList) {
      assert.equal(sitemapPaths.has(page.path), true)
      assert.ok(page.faqs.length >= 3)
      assert.ok(page.paragraphs.length >= 3)
    }
    assert.equal(sitemapPaths.has("/funeral-homes"), true)
  })

  it("emits Product and FAQ JSON-LD for the plaque people can buy", () => {
    const product = getSellableKeepsake(PRIMARY_KEEPSAKE_ID, {})
    assert.ok(product)
    const data = buyerIntentJsonLd(buyerIntentList[0], product)
    const graph = data["@graph"]
    assert.equal(graph[0]["@type"], "Product")
    assert.equal(graph[0].offers["@type"], "Offer")
    assert.equal(graph[0].offers.price, "29.99")
    assert.equal(graph[1]["@type"], "FAQPage")
    assert.equal(graph[1].mainEntity[0].name, buyerIntentList[0].faqs[0].question)
    assert.equal(graph[1].mainEntity[0].acceptedAnswer.text, buyerIntentList[0].faqs[0].answer)
  })
})

describe("funeral home inquiry", () => {
  it("rejects a missing funeral home and emails the inquiry to support", () => {
    assert.equal(parsePartnerInquiry({ name: "Ada", email: "ada@example.com", message: "Hello" }).ok, false)
    const parsed = parsePartnerInquiry({
      name: "Ada Lovelace",
      email: "ada@chapel.example",
      funeralHome: "Chapel House",
      city: "Hanceville, AL",
      phone: "555-0100",
      message: "We would like wholesale pricing for plaques.",
    })
    assert.equal(parsed.ok, true)
    if (!parsed.ok) return
    const email = buildPartnerInquiryEmail(parsed.value, {})
    assert.deepEqual(email.to, ["support@memorialsqr.com"])
    assert.match(email.text, /Chapel House/)
    assert.match(email.text, /Hanceville, AL/)
    assert.match(email.confirmationText, /does not charge a card/)
  })
})
