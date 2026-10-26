import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { buyerIntentList } from "../lib/buyer-intent"
import { DIGITAL_MEMORIAL_ID } from "../lib/catalog"
import { cremationQrJsonLd, cremationQrList, cremationQrPages } from "../lib/cremation-qr-pages"
import { resolveDigitalLanding } from "../lib/digital-landing-attribution"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH } from "../lib/digital-memorial"
import { digitalLandingList } from "../lib/digital-landing"
import { giftIntentList } from "../lib/gift-intent"
import { longTailList } from "../lib/long-tail"
import { pageMetadata, publicPages } from "../lib/seo"

test("cremation pages sell the digital memorial and stay in the sitemap", () => {
  assert.equal(cremationQrList.length, 4)
  const titles = cremationQrList.map((page) => page.title)
  const descriptions = cremationQrList.map((page) => page.description)
  const headings = cremationQrList.map((page) => page.h1)
  assert.equal(new Set(cremationQrList.map((page) => page.path)).size, cremationQrList.length)
  assert.equal(new Set(titles).size, titles.length)
  assert.equal(new Set(descriptions).size, descriptions.length)
  assert.equal(new Set(headings).size, headings.length)

  const newPaths = new Set([cremationQrPages.cremation.path, cremationQrPages.ashes.path])
  const occupied = new Set([
    ...buyerIntentList.map((page) => page.path),
    ...giftIntentList.map((page) => page.path),
    ...longTailList.map((page) => page.path),
    ...digitalLandingList.map((page) => page.path),
  ])
  const sitemap = new Set(
    Object.values(publicPages)
      .filter((page) => page.index && page.inSitemap)
      .map((page) => page.path),
  )
  const allDescriptions = Object.values(publicPages).map((page) => page.description)

  for (const page of cremationQrList) {
    if (newPaths.has(page.path)) assert.equal(occupied.has(page.path), false)
    assert.equal(sitemap.has(page.path), true)
    assert.equal(publicPages[pageKey(page.path)]?.title, page.title)
    assert.equal(publicPages[pageKey(page.path)]?.description, page.description)
    assert.ok(page.title.length <= 60)
    assert.ok(page.description.length <= 155)
    assert.ok(page.paragraphs.length >= 3)
    assert.ok(page.steps.length >= 3)
    assert.ok(page.faqs.length >= 3)
    assert.equal(page.description.includes("29.99"), false)
    assert.equal(page.paragraphs.join(" ").includes("testimonial"), false)
    const data = cremationQrJsonLd(page)
    assert.equal(data["@graph"][0]["@type"], "Product")
    assert.equal(data["@graph"][0].sku, DIGITAL_MEMORIAL_ID)
    assert.equal(data["@graph"][0].offers.price, "24.99")
    assert.equal(data["@graph"][0].offers.priceCurrency, "USD")
    assert.equal("shippingDetails" in data["@graph"][0].offers, false)
    assert.equal("aggregateRating" in data["@graph"][0], false)
    assert.equal(data["@graph"][0].offers.hasMerchantReturnPolicy.merchantReturnDays, 30)
    assert.equal(data["@graph"][1]["@type"], "FAQPage")
    const questions = data["@graph"][1].mainEntity.map((item: { name: string }) => item.name)
    assert.ok(questions.includes(page.faqs[0].question))
    assert.ok(questions.includes("What is the refund policy?"))
    const metadata = pageMetadata(publicPages[pageKey(page.path)])
    assert.equal(
      metadata.alternates && "canonical" in metadata.alternates ? metadata.alternates.canonical : "",
      page.path,
    )
    assert.equal(resolveDigitalLanding(null, page.path), page.path)
    assert.equal(resolveDigitalLanding(page.path, "/checkout/simple"), page.path)
  }

  assert.equal(new Set(allDescriptions).size, allDescriptions.length)
  assert.equal(cremationQrPages.urn.path, "/qr-code-for-urn")
  assert.equal(cremationQrPages.columbarium.path, "/qr-code-for-a-columbarium")
  assert.equal(DIGITAL_MEMORIAL_CHECKOUT_PATH, "/checkout/simple?product=digital-memorial")

  const view = readFileSync(new URL("../components/cremation-qr-view.tsx", import.meta.url), "utf8")
  assert.match(view, /Buy the digital memorial/)
  assert.match(view, /DIGITAL_MEMORIAL_CHECKOUT_PATH/)
  assert.match(view, /TrackViewContent/)
  assert.match(view, /landingPath=\{page\.path\}/)
  assert.match(view, /EXAMPLE_MEMORIAL_PATH/)
  assert.equal(view.toLowerCase().includes("testimonial"), false)

  for (const file of [
    "../app/cremation-memorial-qr-code/page.tsx",
    "../app/ashes-memorial-qr-code/page.tsx",
    "../app/qr-code-for-urn/page.tsx",
    "../app/qr-code-for-a-columbarium/page.tsx",
  ]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8")
    assert.match(source, /CremationQrView/)
    assert.equal(source.includes("29.99"), false)
  }

  const keepsakes = readFileSync(new URL("../app/keepsakes/page.tsx", import.meta.url), "utf8")
  assert.match(keepsakes, /cremationQrList/)
  const homeDisplay = readFileSync(new URL("../lib/long-tail.ts", import.meta.url), "utf8")
  assert.match(homeDisplay, /\/cremation-memorial-qr-code/)
  assert.match(homeDisplay, /\/ashes-memorial-qr-code/)
})

function pageKey(path: string): keyof typeof publicPages {
  const match = Object.entries(publicPages).find(([, page]) => page.path === path)
  if (!match) throw new Error(`Missing public page for ${path}`)
  return match[0] as keyof typeof publicPages
}
