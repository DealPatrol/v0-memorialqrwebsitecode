import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { DIGITAL_MEMORIAL_ID, getCheckoutProduct } from "../lib/catalog"
import { DIGITAL_MEMORIAL_PATH } from "../lib/digital-memorial"
import { EXAMPLE_MEMORIAL_NAME, EXAMPLE_MEMORIAL_PATH } from "../lib/example-memorial"
import {
  CREATE_PAGE_PATH,
  HOLIDAY_COPY,
  ORNAMENT_NOTE,
  SAMPLE_ORNAMENT_NOTE,
  buildHolidayRemembrance,
  exampleHolidayRemembrance,
  holidayDocumentDescription,
  holidayDocumentTitle,
  holidayMemories,
  holidayMetadataInput,
  remembranceHeading,
  remembranceYears,
} from "../lib/holiday-remembrance"
import { HOSTING_INCLUDED_YEARS } from "../lib/hosting"
import {
  EXAMPLE_HOLIDAY_PATH,
  HOLIDAY_ORNAMENT_QR_TEMPLATE,
  holidayRemembrancePath,
  holidayRemembranceUrl,
  isHolidayRemembrancePath,
  memorialPageUrl,
  memorialSlugForOrder,
} from "../lib/memorial-urls"
import { pageMetadata, publicPages } from "../lib/seo"
import { SITE_URL } from "../lib/site"

const CLAIM = /\bfree\b|\$\s?\d|\bhosting\b|\btestimonial\b|\bunlimited\b/i

function source(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
}

function assertNoClaims(label: string, text: string) {
  const found = text.match(CLAIM)
  assert.equal(found, null, `${label} contains "${found?.[0] ?? ""}"`)
}

test("ornament QR codes use the memorial slug plus /holiday", () => {
  assert.equal(HOLIDAY_ORNAMENT_QR_TEMPLATE, "https://memorialsqr.com/memorial/<slug>/holiday")
  assert.equal(EXAMPLE_HOLIDAY_PATH, `${EXAMPLE_MEMORIAL_PATH}/holiday`)
  assert.equal(`${SITE_URL}${EXAMPLE_HOLIDAY_PATH}`, "https://memorialsqr.com/example-memorial/holiday")

  const slug = memorialSlugForOrder("MQ-1001")
  assert.equal(slug, "mq-1001")
  assert.equal(memorialPageUrl(slug), "https://memorialsqr.com/memorial/mq-1001")
  assert.equal(holidayRemembranceUrl(slug), "https://memorialsqr.com/memorial/mq-1001/holiday")
  assert.equal(holidayRemembrancePath("glenda-kelso"), "/memorial/glenda-kelso/holiday")
  assert.equal(
    holidayRemembranceUrl("6f1e3c0a-1b2c-4d3e-8f90-a1b2c3d4e5f6"),
    "https://memorialsqr.com/memorial/6f1e3c0a-1b2c-4d3e-8f90-a1b2c3d4e5f6/holiday",
  )
  assert.equal(holidayRemembrancePath(""), null)
  assert.equal(holidayRemembrancePath("../admin"), null)
  assert.equal(holidayRemembrancePath("has space"), null)
  assert.equal(holidayRemembrancePath("a/b"), null)
})

test("holiday paths are recognized without treating the main memorial as one", () => {
  assert.equal(isHolidayRemembrancePath("/example-memorial/holiday"), true)
  assert.equal(isHolidayRemembrancePath("/example-memorial/holiday/"), true)
  assert.equal(isHolidayRemembrancePath("/example-memorial"), false)
  assert.equal(isHolidayRemembrancePath("/memorial/glenda-kelso/holiday"), true)
  assert.equal(isHolidayRemembrancePath("/memorial/glenda-kelso"), false)
  assert.equal(isHolidayRemembrancePath("/memorial/glenda-kelso/holiday/edit"), false)
  assert.equal(isHolidayRemembrancePath("/memorial/holiday"), false)
  assert.equal(isHolidayRemembrancePath("/holiday"), false)
})

test("sample remembrance uses the example memorial and makes no price claim", () => {
  const page = exampleHolidayRemembrance()
  assert.equal(page.sample, true)
  assert.equal(page.fullName, EXAMPLE_MEMORIAL_NAME)
  assert.equal(page.fullName.includes("Margaret"), false)
  assert.equal(page.heading, "Remembering Alex this Christmas")
  assert.equal(page.years, null)
  assert.equal(page.shareEnabled, false)
  assert.equal(page.memorialId, null)
  assert.equal(page.photos.length, 0)
  assert.equal(page.memories.length, 2)
  assert.equal(page.pagePath, "/example-memorial/holiday")
  assert.equal(page.fullMemorialPath, "/example-memorial")
  assert.match(page.sampleNotice ?? "", /not a real person/)
  assert.equal(page.ornamentNote, SAMPLE_ORNAMENT_NOTE)
  for (const value of Object.values(page)) {
    if (typeof value === "string") assertNoClaims("sample page", value)
  }
  for (const memory of page.memories) {
    assertNoClaims("sample memory", `${memory.title ?? ""} ${memory.body} ${memory.author ?? ""}`)
  }
})

test("family remembrance reuses stories, messages, and approved photo urls", () => {
  const page = buildHolidayRemembrance(
    {
      id: "6f1e3c0a-1b2c-4d3e-8f90-a1b2c3d4e5f6",
      slug: "margaret-ellis",
      full_name: "Margaret Ellis",
      biography: "  She kept the cocoa on the back burner.  ",
      birth_date: "1948-03-02",
      death_date: "2025-12-01",
      profile_image_url: "/placeholder.svg?height=400&width=400",
    },
    [
      { id: "s1", title: "The kitchen", content: "Cocoa on Christmas Eve.", author_name: "Ann", created_at: "2020-01-01T00:00:00.000Z" },
      { id: "s-empty", title: "Blank", content: "   ", author_name: "Skip", created_at: "2024-01-01T00:00:00.000Z" },
    ],
    [
      { id: "m1", content: "We still set her chair.", author_name: "Luis", created_at: "2024-12-01T00:00:00.000Z" },
    ],
    [
      { id: "p1", image_url: "http://example.com/secret.jpg", caption: "no" },
      { id: "p2", image_url: "https://images.example.com/tree.jpg", caption: "The tree" },
      { id: "p3", photo_url: "https://images.example.com/tree.jpg", caption: "duplicate" },
      { id: "p4", image_url: "javascript:alert(1)", caption: "bad" },
    ],
  )
  assert.ok(page)
  assert.equal(page.sample, false)
  assert.equal(page.heading, "Remembering Margaret this Christmas")
  assert.equal(page.years, "1948 – 2025")
  assert.equal(page.familyNote, "She kept the cocoa on the back burner.")
  assert.equal(page.heroImageUrl, "https://images.example.com/tree.jpg")
  assert.equal(page.photos.length, 1)
  assert.equal(page.photos[0]?.caption, "The tree")
  assert.equal(page.shareEnabled, true)
  assert.equal(page.pagePath, "/memorial/margaret-ellis/holiday")
  assert.equal(page.fullMemorialPath, "/memorial/margaret-ellis")
  assert.equal(page.ornamentNote, ORNAMENT_NOTE)
  assert.deepEqual(
    page.memories.map((memory) => memory.id),
    ["message:m1", "story:s1"],
  )
  assert.equal(buildHolidayRemembrance({ slug: "bad slug", full_name: "No" }, [], [], []), null)
})

test("names and years stay literal", () => {
  assert.equal(remembranceHeading("Alex Example"), "Remembering Alex this Christmas")
  assert.equal(remembranceHeading("  María  López "), "Remembering María this Christmas")
  assert.equal(remembranceHeading("In Loving Memory"), "Remembering them this Christmas")
  assert.equal(remembranceHeading("   "), "Remembering them this Christmas")
  assert.equal(remembranceYears("1948-03-02", "2025-12-01"), "1948 – 2025")
  assert.equal(remembranceYears("December 25, 1948", null), "1948")
  assert.equal(remembranceYears(null, null), null)
  assert.equal(remembranceYears("999", "2025-01-01"), "2025")
  assert.equal(remembranceYears("2101-01-01", null), null)
})

test("memory cards cap at twelve and skip blanks", () => {
  const messages = Array.from({ length: 13 }, (_, index) => ({
    id: `m${index}`,
    content: `Memory ${index}`,
    author_name: "Family",
    created_at: `2024-01-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
  }))
  const cards = holidayMemories([], messages)
  assert.equal(cards.length, 12)
  assert.equal(cards[0]?.body, "Memory 12")
  assert.equal(holidayMemories([{ content: "  " }], [{ content: "" }]).length, 0)
})

test("holiday pages are noindex and stay out of the nav and sitemap", () => {
  const sample = holidayMetadataInput({
    path: EXAMPLE_HOLIDAY_PATH,
    fullName: EXAMPLE_MEMORIAL_NAME,
    sample: true,
  })
  assert.equal(sample.index, false)
  assert.equal(sample.title.length <= 60, true)
  assert.equal(sample.description.length <= 155, true)
  assert.equal(sample.title, "Example: Remembering Alex this Christmas | MemorialsQR")
  const metadata = pageMetadata(sample)
  assert.equal(typeof metadata.robots === "object" && metadata.robots !== null && "index" in metadata.robots && metadata.robots.index, false)

  const longName = "Bartholomew Christopher Williamson"
  const title = holidayDocumentTitle(longName, false)
  const description = holidayDocumentDescription(longName.repeat(8), false)
  assert.equal(title.length <= 60, true)
  assert.equal(description.length <= 155, true)
  assert.match(title, /\| MemorialsQR$/)
  holidayMetadataInput({ path: "/memorial/example/holiday", fullName: longName.repeat(4), sample: false })

  for (const page of Object.values(publicPages)) {
    assert.equal(page.path.endsWith("/holiday"), false)
  }
  assert.equal(source("app/sitemap.ts").includes("/holiday"), false)
  assert.equal(source("components/header.tsx").includes("/holiday"), false)
  assert.equal(source("app/example-memorial/page.tsx").includes("/holiday"), false)
  assert.equal(source("app/memorial/[id]/MemorialClientPage.tsx").includes("/holiday"), false)
  assert.match(source("components/footer.tsx"), /isHolidayRemembrancePath/)
  assert.match(source("app/memorial/[id]/holiday/not-found.tsx"), /index: false/)
})

test("visible copy does not claim a price, hosting term, or pre-approval", () => {
  const blobs = [
    ...Object.values(HOLIDAY_COPY),
    ORNAMENT_NOTE,
    SAMPLE_ORNAMENT_NOTE,
    source("components/holiday-remembrance-view.tsx"),
    source("components/holiday-share-memory.tsx"),
    source("app/example-memorial/holiday/page.tsx"),
    source("app/memorial/[id]/holiday/page.tsx"),
    source("app/memorial/[id]/holiday/not-found.tsx"),
    source("lib/holiday-share-copy.ts"),
  ]
  for (const text of blobs) assertNoClaims("holiday copy", text)
  assert.doesNotMatch(HOLIDAY_COPY.ownerRemovalNote, /moderat|approv/i)
  assert.match(HOLIDAY_COPY.ownerRemovalNote, /remove/)
  assert.equal(CREATE_PAGE_PATH, DIGITAL_MEMORIAL_PATH)
  assert.equal(getCheckoutProduct(DIGITAL_MEMORIAL_ID)?.price, 24.99)
  assert.equal(HOSTING_INCLUDED_YEARS, 10)
  assert.match(source("components/holiday-share-memory.tsx"), /\/api\/memorials\/\$\{encodeURIComponent\(memorialId\)\}\/messages/)
  const load = source("lib/holiday-remembrance-load.ts")
  assert.match(load, /from\("stories"\)/)
  assert.match(load, /from\("messages"\)/)
  assert.match(load, /selectPublicMedia\("photos"/)
  assert.doesNotMatch(load, /from\("candles"\)/)
})
