import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { PLAQUE_PRICE, POD_PRODUCTS } from "../lib/catalog"
import { getSellableKeepsake, resolveConfiguredCheckoutItems } from "../lib/fulfillment-availability"
import { configuredPodProducts } from "../lib/fulfillment-readiness"
import { keepsakeProductJsonLd } from "../lib/keepsake-jsonld"
import { buildManualFulfillmentNotice, manualFulfillmentRecipients } from "../lib/manual-fulfillment-email"
import { submitPrintfulOrder } from "../lib/printful"
import { submitPrintifyOrder } from "../lib/printify"
import { googleSiteVerificationTag } from "../lib/seo"
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
  it("hides every supplier product when env vars are missing", () => {
    assert.equal(configuredPodProducts({}).length, 0)
    assert.equal(resolveConfiguredCheckoutItems([{ id: "keep-card", quantity: 1 }], {}), null)
    assert.equal(resolveConfiguredCheckoutItems([{ id: "gold-plaque", quantity: 1 }], readyEnv), null)
  })

  it("sells the QR memorial plaque with no supplier env vars", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "qr-memorial-plaque", quantity: 1 }], {})
    assert.ok(lines)
    assert.equal(lines[0].price, PLAQUE_PRICE)
    assert.equal(lines[0].price, 29.99)
    assert.equal(lines[0].ships, true)
    assert.equal(lines[0].provider, "manual")
    assert.equal(lines[0].syncVariantId, null)
    const page = getSellableKeepsake("qr-memorial-plaque", {})
    assert.ok(page)
    assert.equal(page.name, "QR Memorial Plaque")
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

describe("manual fulfillment notice", () => {
  it("emails Cole the ship-to address and says no supplier order was placed", () => {
    const notice = buildManualFulfillmentNotice(
      {
        order: {
          order_number: "MQR-PLAQUE-1",
          customer_name: "Ada Lovelace",
          customer_email: "ada@example.com",
          customer_phone: "555-0100",
          shipping_address_line1: "1 Main St",
          shipping_address_line2: null,
          shipping_city: "Hanceville",
          shipping_state: "AL",
          shipping_zip: "35077",
          special_instructions: "Ada Lovelace\n1940-2024\ngold",
          payment_id: "pay_123",
          amount_cents: 2999,
        },
        lines: [
          {
            id: "qr-memorial-plaque",
            name: "QR Memorial Plaque",
            price: 29.99,
            quantity: 1,
            ships: true,
            provider: "manual",
            syncVariantId: null,
            templateProductId: null,
            variantId: null,
          },
        ],
        memorialUrl: "https://memorialsqr.com/memorial/mqr-plaque-1",
        printFileUrl: "https://memorialsqr.com/api/print-file/mqr-plaque-1",
        memorialError: null,
      },
      { ADMIN_EMAIL: "cole@example.com" },
    )

    assert.deepEqual(notice.to, ["support@memorialsqr.com", "cole@example.com"])
    assert.match(notice.subject, /MQR-PLAQUE-1/)
    assert.match(notice.text, /No Printful or Printify order was placed/)
    assert.match(notice.text, /1 Main St/)
    assert.match(notice.text, /Hanceville/)
    assert.match(notice.text, /QR Memorial Plaque/)
    assert.match(notice.text, /pay_123/)
    assert.match(notice.text, /\$29\.99/)
    assert.deepEqual(manualFulfillmentRecipients({}), ["support@memorialsqr.com"])
    assert.deepEqual(manualFulfillmentRecipients({ ADMIN_EMAIL: "support@memorialsqr.com" }), [
      "support@memorialsqr.com",
    ])
  })
})

describe("keepsake structured data", () => {
  it("emits Product and Offer JSON-LD for the plaque", () => {
    const product = getSellableKeepsake("qr-memorial-plaque", {})
    assert.ok(product)
    const data = keepsakeProductJsonLd(product)
    assert.equal(data["@type"], "Product")
    assert.equal(data.name, "QR Memorial Plaque")
    assert.equal(data.offers["@type"], "Offer")
    assert.equal(data.offers.price, "29.99")
    assert.equal(data.offers.priceCurrency, "USD")
    assert.equal(data.offers.availability, "https://schema.org/InStock")
    assert.equal(data.offers.url, "https://memorialsqr.com/store/qr-memorial-plaque")
  })
})

describe("Google site verification", () => {
  it("emits the verification token only when the env value is non-empty", () => {
    assert.equal(googleSiteVerificationTag(undefined), undefined)
    assert.equal(googleSiteVerificationTag(""), undefined)
    assert.equal(googleSiteVerificationTag("   "), undefined)
    assert.deepEqual(googleSiteVerificationTag(" abc123 "), { google: "abc123" })
  })
})

describe("catalog coverage", () => {
  it("lists the seven supplier products", () => {
    assert.deepEqual(
      POD_PRODUCTS.map((product) => product.id),
      ["keep-card", "memorial-coaster", "acrylic-keyring", "voice-keychain", "slate-plaque", "pet-tag", "photo-block"],
    )
    assert.equal(configuredPodProducts(readyEnv).length, 7)
  })
})
