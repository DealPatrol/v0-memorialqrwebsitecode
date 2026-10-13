import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { MIN_QR_INCHES } from "../lib/print-layout"
import { buildPrintifyBlueprintPayload, submitPrintifyBlueprintOrder } from "../lib/printify"
import {
  STORE_CATALOG,
  STORE_COLLECTIONS,
  getStoreCatalogProduct,
  isMerchizeProduct,
  resolvedBlueprintId,
} from "../lib/store-catalog"

const PRINTIFY = [
  ["human-photo-canvas", 1159, 49.99, "print"],
  ["human-velveteen-blanket", 522, 49.99, "print"],
  ["human-guest-book", 485, 39.99, "cover"],
  ["human-photo-book", 2737, 39.99, "cover"],
  ["human-sherpa-blanket", 238, 49.99, "print"],
  ["human-wood-sign", 1530, 49.99, "print"],
  ["human-round-pendant", 5374, 34.99, "card-insert"],
  ["human-heart-pendant", 5444, 34.99, "card-insert"],
  ["human-cross-necklace", 2661, 39.99, "card-insert"],
  ["human-slate-desk-plaque", 5344, 44.99, "print"],
] as const

describe("human memorial catalog", () => {
  it("lists every Printify blueprint at the published price and QR placement", () => {
    const ids = STORE_CATALOG.map((product) => product.id)
    assert.equal(new Set(ids).size, ids.length)
    for (const [id, blueprintId, price, surface] of PRINTIFY) {
      const product = getStoreCatalogProduct(id)
      assert.ok(product)
      assert.equal(product.price, price)
      assert.equal(product.fulfillment.kind, "printify")
      if (product.fulfillment.kind === "printify") assert.equal(product.fulfillment.blueprintId, blueprintId)
      assert.equal(product.qr.surface, surface)
      assert.ok(product.qr.minInches >= MIN_QR_INCHES)
      assert.ok(product.collections.includes("human-memorials"))
    }
  })

  it("keeps Merchize pieces out of Printify", () => {
    for (const id of ["human-garden-stone-1", "human-garden-stone-2", "human-wind-chime", "human-pillow-case"]) {
      const product = getStoreCatalogProduct(id)
      assert.ok(product)
      assert.equal(isMerchizeProduct(id), true)
      assert.equal(product.fulfillment.kind, "merchize")
      assert.equal(resolvedBlueprintId(product, {}), null)
      assert.ok(product.qr.minInches >= MIN_QR_INCHES)
    }
    assert.equal(getStoreCatalogProduct("human-garden-stone-1")?.price, 39.99)
    assert.equal(getStoreCatalogProduct("human-garden-stone-2")?.price, 39.99)
    assert.equal(getStoreCatalogProduct("human-wind-chime")?.price, 44.99)
    assert.equal(getStoreCatalogProduct("human-pillow-case")?.price, 34.99)
  })

  it("fills every collection and lets env override a blueprint id", () => {
    for (const collection of STORE_COLLECTIONS) {
      assert.ok(STORE_CATALOG.some((product) => product.collections.includes(collection.id)))
    }
    const canvas = getStoreCatalogProduct("human-photo-canvas")
    assert.ok(canvas)
    assert.equal(resolvedBlueprintId(canvas, { PRINTIFY_HUMAN_PHOTO_CANVAS_BLUEPRINT_ID: "999" }), 999)
    const pet = getStoreCatalogProduct("pet-photo-ornament")
    assert.ok(pet)
    assert.equal(pet.fulfillment.kind === "printify" ? pet.fulfillment.blueprintId : 1, null)
    assert.equal(resolvedBlueprintId(pet, { PRINTIFY_PET_PHOTO_ORNAMENT_BLUEPRINT_ID: "42" }), 42)
  })

  it("builds a high-contrast Printify payload and does not submit it without credentials", async () => {
    const canvas = getStoreCatalogProduct("human-photo-canvas")
    const pendant = getStoreCatalogProduct("human-round-pendant")
    assert.ok(canvas && pendant)
    const payload = buildPrintifyBlueprintPayload({
      orderNumber: "MQR-1",
      recipient: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "",
        address1: "1 Main St",
        address2: "",
        city: "Hanceville",
        state: "AL",
        zip: "35077",
      },
      items: [
        {
          title: canvas.name,
          blueprintId: 1159,
          printProviderId: null,
          variantId: null,
          quantity: 1,
          retailCents: 4999,
          photoUrl: null,
          printFileUrl: "https://memorialsqr.com/api/print-file/abc",
          qrMinInches: canvas.qr.minInches,
          qrSurface: canvas.qr.surface,
          printWidthInches: canvas.qr.printWidthInches,
        },
        {
          title: pendant.name,
          blueprintId: 5374,
          printProviderId: null,
          variantId: null,
          quantity: 1,
          retailCents: 3499,
          photoUrl: "https://example.com/photo.jpg",
          printFileUrl: "https://memorialsqr.com/api/print-file/abc",
          qrMinInches: pendant.qr.minInches,
          qrSurface: pendant.qr.surface,
          printWidthInches: pendant.qr.printWidthInches,
        },
      ],
    })
    assert.equal(payload.products[0].blueprint_id, 1159)
    assert.equal(payload.products[0].qr.contrast, "black-on-white")
    assert.ok(payload.products[0].qr.min_inches >= 1)
    assert.equal(payload.products[0].insert, null)
    assert.equal(payload.products[1].insert?.min_inches, 1.25)
    assert.match(payload.products[1].insert?.note || "", /1 inch/)

    let called = false
    const result = await submitPrintifyBlueprintOrder(
      {
        orderNumber: "MQR-1",
        recipient: {
          name: "Ada Lovelace",
          email: "ada@example.com",
          phone: "",
          address1: "1 Main St",
          address2: "",
          city: "Hanceville",
          state: "AL",
          zip: "35077",
        },
        items: [
          {
            title: canvas.name,
            blueprintId: 1159,
            printProviderId: null,
            variantId: null,
            quantity: 1,
            retailCents: 4999,
            photoUrl: null,
            printFileUrl: "https://memorialsqr.com/api/print-file/abc",
            qrSurface: "print",
            qrMinInches: 1.25,
            printWidthInches: 8,
          },
        ],
        token: "",
        shopId: "",
      },
      async () => {
        called = true
        throw new Error("fetch should not run")
      },
    )
    assert.equal(called, false)
    assert.equal(result.status, "mocked")
    assert.equal(result.payload?.products[0].blueprint_id, 1159)
  })
})
