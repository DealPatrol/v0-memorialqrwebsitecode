import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildLlmsTxt } from "../lib/llms"
import { publicPages } from "../lib/seo"
import { SITE_URL } from "../lib/site"

describe("llms.txt coverage", () => {
  it("lists every indexable page that is in the sitemap", () => {
    const text = buildLlmsTxt({})
    const missing = Object.values(publicPages)
      .filter((page) => page.index && page.inSitemap)
      .map((page) => (page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`))
      .filter((url) => !text.includes(`(${url})`))
    assert.deepEqual(missing, [])
  })

  it("lists the obituary template", () => {
    assert.match(buildLlmsTxt({}), /\/obituary-template\)/)
  })
})
