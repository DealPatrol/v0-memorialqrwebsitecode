import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"
import { readAdConfig, googleAdsSendTo } from "../lib/ad-config"
import { commerceAnalyticsProperties, googleAdsConversion, purchaseAfterPayment } from "../lib/ad-events"
import { resolveDigitalLanding } from "../lib/digital-landing-attribution"
import { adLandingList } from "../lib/ad-landings"
import { firstTouch, formatAttribution, parseAttribution } from "../lib/attribution"
import { breadcrumbJsonLd } from "../lib/breadcrumbs"
import { buyerIntentJsonLd, buyerIntentList, PRIMARY_KEEPSAKE_ID } from "../lib/buyer-intent"
import { HERO_LCP_CSS } from "../lib/critical-css"
import { getSellableKeepsake } from "../lib/fulfillment-availability"
import { giftIntentList } from "../lib/gift-intent"
import { keepsakeProductJsonLd } from "../lib/keepsake-jsonld"
import { longTailList } from "../lib/long-tail"
import { buildGuideLeadNote } from "../lib/memorial-guide"
import { buildPartnerInquiryEmail, parsePartnerInquiry } from "../lib/partner-inquiry"
import { classifyMemorialResponse } from "../lib/memorial-lookup"
import { qrMemorialPlaqueCostFaq } from "../lib/plaque-cost-faq"
import { isWwwHost, shouldNoindexPath, shouldRewriteNotFound } from "../lib/request-indexing"
import { pageMetadata, publicPages } from "../lib/seo"
import { SITE_URL } from "../lib/site"
import { reviewStructuredData } from "../lib/product-reviews"

const root = path.resolve(import.meta.dirname, "..")

describe("ad pixels", () => {
  it("loads nothing when ids are missing or invalid", () => {
    const empty = readAdConfig({})
    assert.equal(empty.metaPixelId, null)
    assert.equal(empty.ga4Id, null)
    assert.equal(empty.googleAdsId, null)
    assert.equal(empty.pinterestTagId, null)
    assert.equal(googleAdsSendTo(empty), null)
    const invalid = readAdConfig({
      NEXT_PUBLIC_META_PIXEL_ID: "pixel",
      NEXT_PUBLIC_GA4_ID: "UA-1",
      NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-nope",
      NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL: "bad label",
      NEXT_PUBLIC_PINTEREST_TAG_ID: "tag",
    })
    assert.equal(invalid.metaPixelId, null)
    assert.equal(invalid.ga4Id, null)
    assert.equal(googleAdsSendTo(invalid), null)
  })

  it("accepts valid ids and withholds the Ads conversion without a label", () => {
    const config = readAdConfig({
      NEXT_PUBLIC_META_PIXEL_ID: "1234567890",
      NEXT_PUBLIC_GA4_ID: "G-ABC123",
      NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123",
      NEXT_PUBLIC_PINTEREST_TAG_ID: "2612345678901",
    })
    assert.equal(config.metaPixelId, "1234567890")
    assert.equal(config.ga4Id, "G-ABC123")
    assert.equal(googleAdsSendTo(config), null)
    const withLabel = readAdConfig({
      NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-123",
      NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL: "purchase",
    })
    assert.equal(googleAdsSendTo(withLabel), "AW-123/purchase")
  })

  it("fires purchase only after a confirmed paid order, with value and currency", () => {
    assert.equal(purchaseAfterPayment({ success: false, amount: 29.99, currency: "USD", orderNumber: "MQR-1" }), null)
    assert.equal(purchaseAfterPayment(null), null)
    const purchase = purchaseAfterPayment({ success: true, amount: 29.99, currency: "USD", orderNumber: "MQR-1" })
    assert.ok(purchase)
    assert.equal(purchase.value, 29.99)
    assert.equal(purchase.currency, "USD")
    assert.equal(purchase.transactionId, "MQR-1")
    const sendTo = googleAdsSendTo(
      readAdConfig({ NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-99", NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL: "buy" }),
    )
    const conversion = googleAdsConversion(purchase, sendTo)
    assert.deepEqual(conversion, { send_to: "AW-99/buy", value: 29.99, currency: "USD", transaction_id: "MQR-1" })
    assert.equal(googleAdsConversion(purchase, null), null)
    assert.equal(googleAdsConversion({ name: "Lead", leadType: "memorial-guide" }, sendTo), null)
  })

  it("keeps the first digital selling page on checkout and purchase events", () => {
    assert.equal(resolveDigitalLanding(null, "/pet-digital-memorial-qr"), "/pet-digital-memorial-qr")
    assert.equal(resolveDigitalLanding("/pet-digital-memorial-qr", "/digital-memorial"), "/pet-digital-memorial-qr")
    assert.equal(resolveDigitalLanding("/pet-digital-memorial-qr", "/checkout/simple"), "/pet-digital-memorial-qr")
    assert.equal(resolveDigitalLanding(null, "/memorial/glenda-kelso"), null)
    assert.equal(resolveDigitalLanding(null, "/example-memorial"), "/example-memorial")

    const purchase = commerceAnalyticsProperties({
      name: "Purchase",
      value: 24.99,
      currency: "USD",
      transactionId: "MQR-1",
      contentId: "digital-memorial",
      landingPath: "/printable-memorial-qr-code",
    })
    assert.equal(purchase.landing_path, "/printable-memorial-qr-code")
    assert.equal(purchase.value, 24.99)
    assert.equal(purchase.transaction_id, "MQR-1")

    const checkout = commerceAnalyticsProperties({
      name: "InitiateCheckout",
      value: 24.99,
      currency: "USD",
      contentId: "digital-memorial",
    })
    assert.equal("landing_path" in checkout, false)
  })
})

describe("attribution", () => {
  it("keeps the first UTM and click ids and attaches them to leads", () => {
    const first = parseAttribution("?utm_source=google&utm_medium=cpc&gclid=abc&fbclid=fb\n")
    assert.deepEqual(first, { utm_source: "google", utm_medium: "cpc", gclid: "abc", fbclid: "fb" })
    assert.equal(firstTouch(first, parseAttribution("?utm_source=later")), first)
    assert.equal(parseAttribution("?unrelated=1"), null)

    const parsed = parsePartnerInquiry({
      name: "Ada Lovelace",
      email: "ada@chapel.example",
      funeralHome: "Chapel House",
      city: "Hanceville, AL",
      phone: "555-0100",
      message: "We would like wholesale pricing for plaques.",
      attribution: { gclid: "click-1", utm_source: "google" },
    })
    assert.equal(parsed.ok, true)
    if (!parsed.ok) return
    const email = buildPartnerInquiryEmail(parsed.value, {})
    assert.match(email.text, /gclid=click-1/)
    assert.match(email.text, /Chapel House/)

    const plain = parsePartnerInquiry({
      name: "Ada Lovelace",
      email: "ada@chapel.example",
      funeralHome: "Chapel House",
      city: "Hanceville, AL",
      phone: "",
      message: "Hello there.",
    })
    assert.equal(plain.ok, true)
    if (!plain.ok) return
    assert.equal(formatAttribution(plain.value.attribution), "")
    assert.equal(buildPartnerInquiryEmail(plain.value, {}).text.includes("Attribution"), false)

    const lead = buildGuideLeadNote("ada@example.com", { fbclid: "fb-9" })
    assert.match(lead.text, /Guide signup: ada@example.com/)
    assert.match(lead.text, /fbclid=fb-9/)
  })
})

describe("technical seo", () => {
  it("gives every public page a unique title and description within limits", () => {
    const pages = Object.values(publicPages)
    const titles = pages.map((page) => page.title)
    const descriptions = pages.map((page) => page.description)
    assert.equal(new Set(titles).size, titles.length)
    assert.equal(new Set(descriptions).size, descriptions.length)
    const paths = pages.map((page) => page.path)
    assert.equal(new Set(paths).size, paths.length)
    assert.equal(publicPages.home.path, "/")
    assert.equal(publicPages.home.title, "Memorial QR Codes for Loved Ones & Pets | MemorialsQR")
    assert.ok(publicPages.home.description.length >= 150 && publicPages.home.description.length <= 155)
    assert.match(publicPages.home.description, /memorial QR code/)
    assert.match(publicPages.home.description, /10 years of hosting/)
    assert.match(publicPages.home.description, /no recurring fees/)
    assert.match(publicPages.home.description, /\$24\.99/)
    assert.equal(publicPages.petMemorials.title, "Pet QR Memorial from $24.99 | MemorialsQR")
    assert.ok(publicPages.petMemorials.description.length >= 150 && publicPages.petMemorials.description.length <= 155)
    assert.match(publicPages.petMemorials.description, /pet memorial QR code/)
    assert.match(publicPages.petMemorials.description, /pet QR memorial plaque/)
    assert.match(publicPages.petMemorials.description, /\$24\.99/)
    assert.match(publicPages.petMemorials.description, /not for sale yet/)
    assert.equal(publicPages.petDigitalMemorialQr.title, "Pet Memorial QR Code, $24.99 | MemorialsQR")
    assert.match(publicPages.petDigitalMemorialQr.description, /pet QR memorial/)
    assert.match(publicPages.petDigitalMemorialQr.description, /pet memorial QR code/)
    assert.equal(publicPages.digitalMemorialGift.title, "Pet QR Memorial Gift, $24.99 | MemorialsQR")
    assert.match(publicPages.digitalMemorialGift.description, /pet QR memorial/)
    assert.match(publicPages.digitalMemorialGift.description, /\$24\.99/)
    for (const page of [publicPages.home, publicPages.petMemorials, publicPages.petDigitalMemorialQr, publicPages.digitalMemorialGift]) {
      const metadata = pageMetadata(page)
      const canonical = metadata.alternates && "canonical" in metadata.alternates ? metadata.alternates.canonical : ""
      assert.equal(canonical, page.path)
      assert.equal(new URL(String(canonical), SITE_URL).origin, "https://memorialsqr.com")
    }
    assert.equal(publicPages.displayAtHome.path, "/memorial-display-at-home")
    assert.notEqual(publicPages.home.title, publicPages.displayAtHome.title)
    for (const page of pages) {
      const metadata = pageMetadata(page)
      assert.equal(metadata.alternates && "canonical" in metadata.alternates ? metadata.alternates.canonical : "", page.path)
      assert.ok(page.title.length > 0 && page.title.length <= 60)
      assert.ok(page.description.length > 0 && page.description.length <= 155)
    }
    const homeMeta = pageMetadata(publicPages.home)
    assert.equal(homeMeta.title, publicPages.home.title)
    assert.equal(homeMeta.description, publicPages.home.description)
    const homeOg = homeMeta.openGraph
    const homeTwitter = homeMeta.twitter
    assert.equal(homeOg && "title" in homeOg ? homeOg.title : "", publicPages.home.title)
    assert.equal(homeOg && "description" in homeOg ? homeOg.description : "", publicPages.home.description)
    assert.equal(homeTwitter && "title" in homeTwitter ? homeTwitter.title : "", publicPages.home.title)
    assert.equal(homeTwitter && "description" in homeTwitter ? homeTwitter.description : "", publicPages.home.description)
    const petMeta = pageMetadata(publicPages.petMemorials)
    const petOg = petMeta.openGraph
    const petTwitter = petMeta.twitter
    assert.equal(petOg && "title" in petOg ? petOg.title : "", publicPages.petMemorials.title)
    assert.equal(petOg && "description" in petOg ? petOg.description : "", publicPages.petMemorials.description)
    assert.equal(petTwitter && "title" in petTwitter ? petTwitter.title : "", publicPages.petMemorials.title)
    assert.equal(petTwitter && "description" in petTwitter ? petTwitter.description : "", publicPages.petMemorials.description)
    assert.equal(petMeta.alternates && "canonical" in petMeta.alternates ? petMeta.alternates.canonical : "", "/pet-memorials")
  })

  it("points the homepage at its own metadata and keeps the header on a phone", () => {
    const home = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8")
    const pet = fs.readFileSync(path.join(root, "app/pet-memorials/page.tsx"), "utf8")
    const display = fs.readFileSync(path.join(root, "app/memorial-display-at-home/page.tsx"), "utf8")
    const header = fs.readFileSync(path.join(root, "components/header.tsx"), "utf8")
    assert.match(home, /pageMetadata\(publicPages\.home\)/)
    assert.match(home, /href="\/pet-memorials"/)
    assert.match(home, /Pet memorial QR codes/)
    assert.match(home, /href="\/store"/)
    assert.match(pet, /pageMetadata\(publicPages\.petMemorials\)/)
    assert.match(pet, /A pet memorial QR code/)
    assert.equal(home.includes("<footer"), false)
    assert.match(home, /Join the list/)
    assert.match(home, /Shop Keepsakes/)
    assert.match(home, /Have Us Build It/)
    assert.match(home, /KEEPSAKE_COLLECTION_PATH/)
    assert.match(home, /#plaque-waitlist/)
    assert.match(display, /pageMetadata\(publicPages\.displayAtHome\)/)
    assert.equal(display.includes("publicPages.home"), false)
    assert.match(header, /h-8 w-auto md:h-10/)
    assert.match(header, /md:mr-8/)
  })

  it("separates similar gift pages and keeps ad landings out of the index", () => {
    const byPath = new Map(giftIntentList.map((page) => [page.path, page]))
    const descriptions = Object.values(publicPages)
      .filter((page) => byPath.has(page.path))
      .map((page) => page.description)
    assert.equal(new Set(descriptions).size, descriptions.length)
    const joined = descriptions.join("\n")
    assert.match(joined, /flowers/)
    assert.match(joined, /recipes/)
    assert.match(joined, /driveway/)
    assert.match(joined, /collar/)
    assert.match(joined, /engraved/)
    assert.match(joined, /friend/)

    const sitemap = new Set(Object.values(publicPages).filter((page) => page.inSitemap).map((page) => page.path))
    for (const landing of adLandingList) {
      const page = Object.values(publicPages).find((item) => item.path === landing.path)
      assert.ok(page)
      assert.equal(page.index, false)
      assert.equal(page.inSitemap, false)
      assert.equal(sitemap.has(landing.path), false)
      const metadata = pageMetadata(page)
      assert.equal(metadata.robots && typeof metadata.robots === "object" ? metadata.robots.index : true, false)
    }
    const source = fs.readFileSync(path.join(root, "components/ad-landing-view.tsx"), "utf8")
    assert.equal(source.split("<Link ").length - 1, 1)
  })

  it("publishes eight new long-tail guides with real product schema and no invented reviews", () => {
    assert.equal(longTailList.length, 11)
    const paths = longTailList.map((page) => page.path)
    assert.equal(new Set(paths).size, paths.length)
    const buyerPaths = new Set(buyerIntentList.map((page) => page.path))
    const giftPaths = new Set(giftIntentList.map((page) => page.path))
    const sitemap = new Set(Object.values(publicPages).filter((page) => page.inSitemap).map((page) => page.path))
    const product = getSellableKeepsake(PRIMARY_KEEPSAKE_ID, {})
    assert.ok(product)
    for (const page of longTailList) {
      assert.equal(buyerPaths.has(page.path), false)
      assert.equal(giftPaths.has(page.path), false)
      assert.equal(sitemap.has(page.path), true)
      assert.ok(page.paragraphs.length >= 3)
      assert.ok(page.faqs.length >= 3)
      const data = buyerIntentJsonLd(page, product)
      assert.equal(data["@graph"][0]["@type"], "Product")
      assert.equal(data["@graph"][0].offers.price, "29.99")
      assert.equal(data["@graph"][1]["@type"], "FAQPage")
      assert.equal("aggregateRating" in data["@graph"][0], false)
    }
    assert.equal(reviewStructuredData([]), null)
    assert.equal("aggregateRating" in keepsakeProductJsonLd(product), false)
    const crumbs = breadcrumbJsonLd([
      { href: "/", label: "Home" },
      { href: "/guides", label: "Guides" },
    ])
    assert.equal(crumbs["@type"], "BreadcrumbList")
    assert.equal(crumbs.itemListElement[1].position, 2)
  })

  it("resolves internal links and does not block the hero on unused font hosts", () => {
    const routes = new Set<string>()
    function addRoutes(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) addRoutes(full)
        else if (entry.name === "page.tsx") {
          const rel = path.relative(path.join(root, "app"), full).replace(/\\/g, "/")
          const trimmed = rel === "page.tsx" ? "" : rel.replace(/\/page\.tsx$/, "")
          const segments = trimmed
            .split("/")
            .filter((segment) => segment && !segment.startsWith("("))
          routes.add(segments.length ? `/${segments.join("/")}` : "/")
        }
      }
    }
    addRoutes(path.join(root, "app"))
    const redirects = new Set(["/privacy", "/terms"])

    function matches(href: string): boolean {
      if (routes.has(href) || redirects.has(href)) return true
      const parts = href.split("/").filter(Boolean)
      for (const route of routes) {
        const routeParts = route.split("/").filter(Boolean)
        if (routeParts.length !== parts.length) continue
        const ok = routeParts.every((segment, index) => segment.startsWith("[") || segment === parts[index])
        if (ok) return true
      }
      return false
    }

    const broken: string[] = []
    function scan(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === "node_modules" || entry.name === ".next") continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) scan(full)
        else if (/\.(tsx|ts)$/.test(entry.name)) {
          const text = fs.readFileSync(full, "utf8")
          for (const match of text.matchAll(/href=["'](\/[^"'#?]*)/g)) {
            const href = match[1] || "/"
            if (!matches(href)) broken.push(`${path.relative(root, full)} -> ${href}`)
          }
        }
      }
    }
    scan(path.join(root, "app"))
    scan(path.join(root, "components"))
    assert.deepEqual(broken, [])

    const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8")
    const home = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8")
    const productPage = fs.readFileSync(path.join(root, "app/store/[id]/page.tsx"), "utf8")
    assert.equal(layout.includes("fonts.googleapis.com"), false)
    assert.match(layout, /HERO_LCP_CSS/)
    assert.match(home, /hero-lcp/)
    assert.match(HERO_LCP_CSS, /\.hero-lcp/)
    assert.match(productPage, /sizes=/)
    assert.match(productPage, /alt=\{product\.imageAlt\}/)
    assert.equal(fs.readFileSync(path.join(root, "components/footer.tsx"), "utf8").includes("/ads/"), true)
  })
})

describe("search console indexing", () => {
  it("answers the plaque cost question with catalog prices and links the near-page-1 URLs", () => {
    const faq = qrMemorialPlaqueCostFaq()
    assert.equal(faq.question, "How much does a QR memorial plaque cost?")
    assert.match(faq.answer, /\$24\.99 USD/)
    assert.match(faq.answer, /\$29\.99 USD/)
    assert.match(faq.answer, /coming soon/)
    assert.match(faq.answer, /not for sale yet/)
    assert.match(faq.answer, /Nothing is shipped/)
    const home = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8")
    const store = fs.readFileSync(path.join(root, "app/store/page.tsx"), "utf8")
    const pricing = fs.readFileSync(path.join(root, "app/pricing/page.tsx"), "utf8")
    const petLayout = fs.readFileSync(path.join(root, "app/pet-memorials/layout.tsx"), "utf8")
    for (const source of [home, store, pricing, petLayout]) {
      assert.match(source, /PlaqueCostAnswer/)
    }
    assert.match(home, /buyerPathLabel/)
    assert.match(home, /href="\/pet-memorials"/)
    assert.match(home, /Pet memorial QR codes/)
    const answer = fs.readFileSync(path.join(root, "components/plaque-cost-answer.tsx"), "utf8")
    assert.match(answer, /plaqueCostFaqJsonLd/)
    assert.match(answer, /PRIORITY_BUYER_LINKS/)
    const links = fs.readFileSync(path.join(root, "lib/buyer-path-links.ts"), "utf8")
    assert.match(links, /\/pet-digital-memorial-qr/)
    assert.match(links, /\/digital-memorial-page-gift/)
    assert.match(links, /\/create-memorial-qr-code-online/)
    assert.match(fs.readFileSync(path.join(root, "lib/plaque-cost-faq.ts"), "utf8"), /FAQPage/)
  })

  it("sends www to the apex and returns 404 for empty or missing pages", () => {
    assert.equal(isWwwHost("www.memorialsqr.com"), true)
    assert.equal(isWwwHost("www.memorialsqr.com:443"), true)
    assert.equal(isWwwHost("memorialsqr.com"), false)
    assert.equal(shouldRewriteNotFound("/test-square", new URLSearchParams()), true)
    assert.equal(shouldRewriteNotFound("/order-confirmation", new URLSearchParams()), true)
    assert.equal(shouldRewriteNotFound("/order-confirmation", new URLSearchParams("orderNumber=1001")), false)
    assert.equal(shouldRewriteNotFound("/order-success", new URLSearchParams()), true)
    assert.equal(shouldRewriteNotFound("/order-success", new URLSearchParams("order=1001")), false)
    assert.equal(shouldNoindexPath("/cart"), true)
    assert.equal(shouldNoindexPath("/sample-memorial-created"), true)
    assert.equal(shouldNoindexPath("/auth/login"), true)
    assert.equal(shouldNoindexPath("/pet-memorials"), false)
    assert.equal(classifyMemorialResponse("SAMPLE-1", 200, false), "missing")
    assert.equal(classifyMemorialResponse("missing-slug", 404, false), "missing")
    assert.equal(classifyMemorialResponse("glenda-kelso", 200, true), "found")
    assert.equal(classifyMemorialResponse("glenda-kelso", 500, false), "unknown")
    const memorial = fs.readFileSync(path.join(root, "app/memorial/[id]/page.tsx"), "utf8")
    assert.match(memorial, /notFound\(\)/)
    assert.match(fs.readFileSync(path.join(root, "app/test-square/page.tsx"), "utf8"), /notFound\(\)/)
    assert.match(fs.readFileSync(path.join(root, "middleware.ts"), "utf8"), /isWwwHost/)
    assert.match(fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8"), /metadataBase: new URL\(SITE_URL\)/)
  })
})
