import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"
import { pageMetadata, PAGES_WITH_OWN_SOCIAL_IMAGE } from "../lib/seo"

function foldersWithOwnImage(dir = path.join(process.cwd(), "app"), prefix = ""): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("(")) continue
    const route = `${prefix}/${entry.name}`
    if (fs.existsSync(path.join(dir, entry.name, "opengraph-image.tsx"))) out.push(route)
    out.push(...foldersWithOwnImage(path.join(dir, entry.name), route))
  }
  return out
}

describe("social images", () => {
  it("lists every static folder that has its own opengraph-image", () => {
    assert.deepEqual([...PAGES_WITH_OWN_SOCIAL_IMAGE].sort(), foldersWithOwnImage().sort())
  })

  it("uses a page's own image when it has one, the site image otherwise", () => {
    const own = pageMetadata({ title: "t", description: "d", path: "/cat-memorial-qr-code" })
    assert.match(JSON.stringify(own.openGraph), /\/cat-memorial-qr-code\/opengraph-image/)
    assert.deepEqual(own.twitter && "images" in own.twitter ? own.twitter.images : null, ["/cat-memorial-qr-code/twitter-image"])
    const store = pageMetadata({ title: "t", description: "d", path: "/store/qr-memorial-plaque" })
    assert.match(JSON.stringify(store.openGraph), /\/store\/qr-memorial-plaque\/opengraph-image/)
    const plain = pageMetadata({ title: "t", description: "d", path: "/pricing" })
    assert.match(JSON.stringify(plain.openGraph), /"url":"\/opengraph-image"/)
  })
})
