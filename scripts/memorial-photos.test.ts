import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { dedupePhotos, memorialInitials, MEMORIAL_DEFAULT_BACKGROUND } from "../lib/memorial-photos"
import { GLENDA_LEGACY_PORTRAIT, GLENDA_MEMORIAL_CARD, GLENDA_PHOTOS, GLENDA_PORTRAIT } from "../lib/glenda-memorial"

const publicFile = (src: string) => join(process.cwd(), "public", src)

describe("memorial photos", () => {
  it("builds monogram initials from names", () => {
    assert.equal(memorialInitials("Glenda Jane Kelso"), "GK")
    assert.equal(memorialInitials("Janice & Earl Melton"), "JM")
    assert.equal(memorialInitials("Paroisse Universitaire Notre Dame de l'Espérance (PUNDE)"), "PE")
    assert.equal(memorialInitials("Cher"), "C")
    assert.equal(memorialInitials(""), "")
  })

  it("drops duplicate photo URLs", () => {
    const photos = dedupePhotos([
      { id: "1", src: "/a.jpg" },
      { id: "2", src: "/a.jpg" },
      { id: "3", src: "/b.jpg" },
      { id: "4", src: " " },
    ])
    assert.deepEqual(
      photos.map((photo) => photo.id),
      ["1", "3"],
    )
  })

  it("ships every local Glenda photo and the default background", () => {
    for (const src of [GLENDA_PORTRAIT, GLENDA_MEMORIAL_CARD, GLENDA_LEGACY_PORTRAIT, MEMORIAL_DEFAULT_BACKGROUND]) {
      assert.ok(existsSync(publicFile(src)), `${src} is missing from public/`)
    }
    for (const photo of GLENDA_PHOTOS.filter((photo) => photo.src.startsWith("/"))) {
      assert.ok(existsSync(publicFile(photo.src)), `${photo.src} is missing from public/`)
    }
    assert.equal(dedupePhotos(GLENDA_PHOTOS).length, GLENDA_PHOTOS.length)
  })
})
