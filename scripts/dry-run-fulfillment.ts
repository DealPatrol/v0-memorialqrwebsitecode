import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { POD_PRODUCTS } from "../lib/catalog"
import { resolveConfiguredCheckoutItems } from "../lib/fulfillment-availability"
import { configuredPodProducts } from "../lib/fulfillment-readiness"
import { submitPrintfulOrder } from "../lib/printful"
import { submitPrintifyOrder } from "../lib/printify"
import { dispatchSupplierLines } from "../lib/supplier-dispatch"

const recipient = {
  name: "Cole Collins",
  address1: "1 Main St",
  city: "Hanceville",
  state: "AL",
  zip: "35077",
  email: "cole@example.com",
}

const readyEnv = {
  PRINTFUL_API_TOKEN: "printful-token",
  PRINTFUL_KEEP_CARD_TEMPLATE_ID: "1001",
  PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID: "1002",
  PRINTFUL_MEMORIAL_ORNAMENT_TEMPLATE_ID: "1003",
  PRINTIFY_API_TOKEN: "printify-token",
  PRINTIFY_SHOP_ID: "42",
  PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID: "prod-keyring",
  PRINTIFY_ACRYLIC_KEYRING_VARIANT_ID: "501",
  PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID: "prod-voice",
  PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID: "502",
  PRINTIFY_SLATE_PLAQUE_PRODUCT_ID: "prod-slate",
  PRINTIFY_SLATE_PLAQUE_VARIANT_ID: "503",
  PRINTIFY_PET_TAG_PRODUCT_ID: "prod-pet",
  PRINTIFY_PET_TAG_VARIANT_ID: "504",
  PRINTIFY_PHOTO_BLOCK_PRODUCT_ID: "prod-block",
  PRINTIFY_PHOTO_BLOCK_VARIANT_ID: "505",
}

describe("supplier env gating", () => {
  it("hides every physical product when env vars are missing", () => {
    assert.equal(configuredPodProducts({}).length, 0)
    assert.equal(resolveConfiguredCheckoutItems([{ id: "keep-card", quantity: 1 }], {}), null)
    assert.equal(resolveConfiguredCheckoutItems([{ id: "gold-plaque", quantity: 1 }], readyEnv), null)
  })

  it("sells a product only after its own ids are set, at the catalog price", () => {
    const keepOnly = {
      PRINTFUL_API_TOKEN: "token",
      PRINTFUL_KEEP_CARD_TEMPLATE_ID: "1001",
    }
    const visible = configuredPodProducts(keepOnly).map((product) => product.id)
    assert.deepEqual(visible, ["keep-card"])

    const lines = resolveConfiguredCheckoutItems([{ id: "keep-card", quantity: 2 }], keepOnly)
    assert.ok(lines)
    assert.equal(lines[0].price, 39.99)
    assert.equal(lines[0].syncVariantId, "1001")
    assert.equal(resolveConfiguredCheckoutItems([{ id: "memorial-coaster", quantity: 1 }], keepOnly), null)
  })

  it("rejects a template id that is not a number", () => {
    const env = { PRINTFUL_API_TOKEN: "token", PRINTFUL_KEEP_CARD_TEMPLATE_ID: "not-an-id" }
    assert.equal(configuredPodProducts(env).length, 0)
  })

  it("keeps digital concierge available without supplier keys", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "concierge-digital", quantity: 1 }], {})
    assert.ok(lines)
    assert.equal(lines[0].price, 299.99)
    assert.equal(lines[0].ships, false)
  })
})

describe("Printful production order", () => {
  it("confirms the order and sends the QR file to the US address", async () => {
    const calls: Array<{ url: string; body: Record<string, unknown> }> = []
    const fetchImpl = async (url: string, init?: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init?.body || "{}")) })
      return new Response(JSON.stringify({ result: { id: 88, status: "pending" } }), { status: 200 })
    }

    const result = await submitPrintfulOrder(
      {
        orderNumber: "MQR-1",
        recipient,
        token: "printful-token",
        items: [{ syncVariantId: "1001", quantity: 1, printFileUrl: "https://memorialsqr.com/api/print-file/mqr-1" }],
      },
      fetchImpl,
    )

    assert.equal(result.status, "submitted")
    assert.equal(result.fulfillmentId, "88")
    assert.match(calls[0].url, /\/orders\?confirm=1$/)
    const body = calls[0].body as {
      recipient: { country_code: string }
      items: Array<{ sync_variant_id: number; files: Array<{ url: string }> }>
    }
    assert.equal(body.recipient.country_code, "US")
    assert.equal(body.items[0].sync_variant_id, 1001)
    assert.equal(body.items[0].files[0].url, "https://memorialsqr.com/api/print-file/mqr-1")
  })

  it("fails when Printful leaves the order as a draft", async () => {
    const fetchImpl = async () => new Response(JSON.stringify({ result: { id: 9, status: "draft" } }), { status: 200 })
    const result = await submitPrintfulOrder(
      {
        orderNumber: "MQR-2",
        recipient,
        token: "printful-token",
        items: [{ syncVariantId: "1001", quantity: 1, printFileUrl: "https://memorialsqr.com/api/print-file/mqr-2" }],
      },
      fetchImpl,
    )
    assert.equal(result.status, "failed")
    assert.match(result.error || "", /draft/)
  })
})

describe("Printify production order", () => {
  it("uploads the QR, orders the new product, and sends it to production", async () => {
    const calls: string[] = []
    const fetchImpl = async (url: string) => {
      calls.push(url)
      if (url.includes("/products/prod-keyring.json")) {
        return new Response(JSON.stringify({ blueprint_id: 9, print_provider_id: 3, print_areas: [] }), { status: 200 })
      }
      if (url.endsWith("/uploads/images.json")) {
        return new Response(JSON.stringify({ id: "img-1" }), { status: 200 })
      }
      if (url.endsWith("/products.json")) {
        return new Response(JSON.stringify({ id: "new-product" }), { status: 200 })
      }
      if (url.endsWith("/orders.json")) {
        return new Response(JSON.stringify({ id: "order-7" }), { status: 200 })
      }
      if (url.endsWith("/send_to_production.json")) {
        return new Response(JSON.stringify({ status: "success" }), { status: 200 })
      }
      return new Response("missing", { status: 404 })
    }

    const result = await submitPrintifyOrder(
      {
        orderNumber: "MQR-3",
        recipient,
        token: "printify-token",
        shopId: "42",
        items: [
          {
            templateProductId: "prod-keyring",
            variantId: "501",
            quantity: 1,
            printFileUrl: "https://memorialsqr.com/api/print-file/mqr-3",
            retailCents: 1999,
            title: "Acrylic QR Keyring",
          },
        ],
      },
      fetchImpl,
    )

    assert.equal(result.status, "submitted")
    assert.equal(result.fulfillmentId, "order-7")
    assert.ok(calls.some((url) => url.endsWith("/send_to_production.json")))
  })

  it("reports failure when production is not accepted", async () => {
    const fetchImpl = async (url: string) => {
      if (url.includes("/products/prod-keyring.json")) {
        return new Response(JSON.stringify({ blueprint_id: 9, print_provider_id: 3 }), { status: 200 })
      }
      if (url.endsWith("/uploads/images.json")) return new Response(JSON.stringify({ id: "img-1" }), { status: 200 })
      if (url.endsWith("/products.json")) return new Response(JSON.stringify({ id: "new-product" }), { status: 200 })
      if (url.endsWith("/orders.json")) return new Response(JSON.stringify({ id: "order-8" }), { status: 200 })
      return new Response(JSON.stringify({ error: "payment method" }), { status: 402 })
    }

    const result = await dispatchSupplierLines(
      {
        orderNumber: "MQR-4",
        recipient,
        env: readyEnv,
        lines: [
          {
            provider: "printify",
            quantity: 1,
            printFileUrl: "https://memorialsqr.com/api/print-file/mqr-4",
            templateProductId: "prod-keyring",
            variantId: "501",
            retailCents: 1999,
            title: "Acrylic QR Keyring",
          },
        ],
      },
      fetchImpl,
    )

    assert.equal(result.status, "failed")
    assert.equal(result.fulfillmentId, "order-8")
    assert.match(result.error || "", /production/)
  })
})

describe("catalog coverage", () => {
  it("lists the eight supplier products", () => {
    assert.deepEqual(
      POD_PRODUCTS.map((product) => product.id),
      ["keep-card", "memorial-coaster", "memorial-ornament", "acrylic-keyring", "voice-keychain", "slate-plaque", "pet-tag", "photo-block"],
    )
    assert.equal(configuredPodProducts(readyEnv).length, 8)
  })
})
