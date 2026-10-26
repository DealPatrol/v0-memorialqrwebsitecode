import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { DIGITAL_MEMORIAL_ID, QR_MEMORIAL_PLAQUE_ID } from "../lib/catalog"
import { buyerIntentList } from "../lib/buyer-intent"
import { resolveDigitalLanding } from "../lib/digital-landing-attribution"
import { digitalLandingList } from "../lib/digital-landing"
import { giftIntentList } from "../lib/gift-intent"
import { graveQrJsonLd, graveQrList, graveQrSellingPaths, GRAVE_QR_CHECKOUT_PATH } from "../lib/grave-qr-pages"
import { longTailList } from "../lib/long-tail"
import { pageMetadata, publicPages } from "../lib/seo"
import { sympathyGiftList } from "../lib/sympathy-gift-pages"

const servicePaths = [
  "/qr-code-for-funeral-program",
  "/celebration-of-life-qr-code",
  "/obituary-qr-code",
  "/memorial-service-slideshow-qr-code",
]

test("grave and cemetery pages sell the digital memorial and keep plaques on the waitlist", () => {
  assert.equal(graveQrList.length, 4)
  const paths = graveQrList.map((page) => page.path)
  const titles = graveQrList.map((page) => page.title)
  const descriptions = graveQrList.map((page) => page.description)
  const headings = graveQrList.map((page) => page.h1)
  const openings = graveQrList.map((page) => page.paragraphs[0])
  for (const values of [paths, titles, descriptions, headings, openings]) {
    assert.equal(new Set(values).size, values.length)
  }

  const occupied = new Set([
    ...buyerIntentList.map((page) => page.path),
    ...giftIntentList.map((page) => page.path),
    ...longTailList.map((page) => page.path),
    ...digitalLandingList.map((page) => page.path),
    ...sympathyGiftList.map((page) => page.path),
    ...servicePaths,
  ])
  const sitemap = new Set(
    Object.values(publicPages)
      .filter((page) => page.index && page.inSitemap)
      .map((page) => page.path),
  )
  const existingTitles = new Set(
    Object.values(publicPages)
      .filter((page) => !paths.includes(page.path))
      .map((page) => page.title),
  )

  for (const page of graveQrList) {
    assert.equal(occupied.has(page.path), false)
    assert.equal(sitemap.has(page.path), true)
    assert.equal(sitemap.has(page.guidePath), true)
    assert.equal(resolveDigitalLanding(null, page.path), page.path)
    assert.equal(resolveDigitalLanding(null, page.guidePath), page.guidePath)
    assert.equal(existingTitles.has(page.title), false)
    assert.ok(page.paragraphs.length >= 3)
    assert.ok(page.steps.length >= 3)
    assert.ok(page.faqs.length >= 3)
    assert.ok(page.title.length <= 60)
    assert.ok(page.description.length >= 120)
    assert.ok(page.description.length <= 155)
    const joined = `${page.h1} ${page.description} ${page.paragraphs.join(" ")} ${page.faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" ")} ${page.guideNote}`
    const lower = joined.toLowerCase()
    assert.equal(lower.includes("testimonial"), false)
    assert.equal(lower.includes("review"), false)
    assert.match(joined, /\$24\.99/)
    assert.match(joined, /Nothing is shipped/)
    assert.match(lower, /coming soon/)
    assert.equal(lower.includes("we ship the plaque"), false)
    assert.equal(joined.includes("29.99"), false)
    const metadata = pageMetadata(publicPages[pageKey(page.path)])
    assert.equal(metadata.alternates && "canonical" in metadata.alternates ? metadata.alternates.canonical : "", page.path)
    const data = graveQrJsonLd(page)
    assert.equal(data["@graph"][0].sku, DIGITAL_MEMORIAL_ID)
    assert.equal(data["@graph"][0].offers.price, "24.99")
    assert.equal(data["@graph"][0].offers.priceCurrency, "USD")
    assert.equal(data["@graph"][0].offers.availability, "https://schema.org/InStock")
    assert.equal("shippingDetails" in data["@graph"][0].offers, false)
    assert.equal("aggregateRating" in data["@graph"][0], false)
    assert.equal(JSON.stringify(data).includes(QR_MEMORIAL_PLAQUE_ID), false)
    assert.equal(data["@graph"][1]["@type"], "FAQPage")
    assert.equal(data["@graph"][1].mainEntity[0].name, page.faqs[0].question)
    const questions = data["@graph"][1].mainEntity.map((item: { name: string }) => item.name)
    assert.ok(questions.includes("What is the refund policy?"))
  }

  assert.equal(GRAVE_QR_CHECKOUT_PATH, "/checkout/simple?product=digital-memorial")
  assert.deepEqual(new Set(graveQrSellingPaths()), new Set([...paths, ...graveQrList.map((page) => page.guidePath)]))

  const view = readFileSync(new URL("../components/grave-qr-view.tsx", import.meta.url), "utf8")
  assert.match(view, /GRAVE_QR_CHECKOUT_PATH/)
  assert.match(view, /Buy the digital memorial/)
  assert.match(view, /PlaqueWaitlistForm/)
  assert.match(view, /GRAVE_QR_PLAQUE_ID/)
  assert.match(view, /landingPath=\{page\.path\}/)
  assert.match(view, /TrackViewContent/)
  assert.match(view, /EXAMPLE_MEMORIAL_PATH/)
  assert.equal(view.includes("Buy the QR Memorial Plaque"), false)

  const guide = readFileSync(new URL("../components/buyer-intent-view.tsx", import.meta.url), "utf8")
  assert.match(guide, /DIGITAL_MEMORIAL_CHECKOUT_PATH/)
  assert.match(guide, /Buy the digital memorial/)
  assert.match(guide, /landingPath=\{page\.path\}/)

  for (const file of [
    "../app/qr-code-for-headstone/page.tsx",
    "../app/grave-marker-qr-code/page.tsx",
    "../app/cemetery-qr-code/page.tsx",
    "../app/memorial-qr-code-plaque/page.tsx",
  ]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8")
    assert.match(source, /digitalOffer/)
    assert.match(source, /graveQrPages/)
  }
})

function pageKey(path: string): keyof typeof publicPages {
  const match = Object.entries(publicPages).find(([, page]) => page.path === path)
  if (!match) throw new Error(`Missing public page for ${path}`)
  return match[0] as keyof typeof publicPages
}
