/**
 * Logic-only checks for one-time keepsake checkout with 10 years of included hosting.
 * There is no monthly plan. Every Square call is answered by a local mock; no network
 * request and no card charge.
 * Run: pnpm test:checkout
 */
import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { POD_PRODUCTS } from "../lib/catalog"
import { resolveConfiguredCheckoutItems, listSellableProducts } from "../lib/fulfillment-availability"
import { paymentMatchesQuote, quoteCheckout } from "../lib/checkout-quote"
import { getHostingTerms, HOSTING_INCLUDED_YEARS } from "../lib/hosting"

const ORDER_DATE = new Date("2026-10-07T17:00:00.000Z")

const podEnv: Record<string, string> = {
  PRINTFUL_API_TOKEN: "t",
  PRINTFUL_KEEP_CARD_TEMPLATE_ID: "1001",
  PRINTIFY_API_TOKEN: "t",
  PRINTIFY_SHOP_ID: "1",
  PRINTIFY_PET_TAG_PRODUCT_ID: "prod-pet",
  PRINTIFY_PET_TAG_VARIANT_ID: "70870",
}

describe("catalog", () => {
  it("physical keepsakes include 10 years of hosting and sell above landed cost", () => {
    assert.equal(HOSTING_INCLUDED_YEARS, 10)
    for (const product of POD_PRODUCTS) {
      assert.equal(product.hostingIncludedYears, 10, product.id)
      assert.ok(!("monthlyFee" in product), `${product.id} has no monthly fee field`)
      assert.ok(product.price > product.blank.baseCostUsd + product.blank.shippingUsd, `${product.id} sells above landed cost`)
    }
  })

  it("no keepsake copy claims forever or weatherproof", () => {
    const text = JSON.stringify(POD_PRODUCTS).toLowerCase()
    for (const banned of ["forever", "weatherproof", "weather-proof", "waterproof", "outdoor", "lifetime"]) {
      assert.ok(!text.includes(banned), banned)
    }
  })
})

describe("no monthly page", () => {
  it("digital-memorial is never sellable, even if a plan id is set", () => {
    const env = { ...podEnv, SQUARE_SUBSCRIPTION_PLAN_ID: "PLANVAR123" }
    assert.ok(!listSellableProducts(env).some((p) => p.id === "digital-memorial"))
    assert.equal(resolveConfiguredCheckoutItems([{ id: "digital-memorial", quantity: 1 }], env), null)
  })
})

describe("quoteCheckout", () => {
  const env = { ...podEnv }

  it("physical keepsake: one charge, hosting included for 10 years", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "pet-tag", quantity: 2 }], env)!
    const result = quoteCheckout(lines, ORDER_DATE)
    assert.ok(result.ok)
    assert.equal(result.quote.totalCents, 2 * 2999)
    assert.equal(result.quote.hostingTerms.includesPhysicalKeepsake, true)
    assert.equal(result.quote.hostingTerms.hostingIncludedUntil, "2036-10-07T17:00:00.000Z")
    assert.ok(!("needsSubscription" in result.quote))
  })

  it("concierge: one charge with 10 years of hosting included", () => {
    const solo = quoteCheckout(resolveConfiguredCheckoutItems([{ id: "concierge-digital", quantity: 1 }], env)!, ORDER_DATE)
    assert.ok(solo.ok && solo.quote.totalCents === 29999)
    assert.equal(solo.quote.hostingTerms.hostingIncludedUntil, "2036-10-07T17:00:00.000Z")
  })

  it("never trusts a client price", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "pet-tag", quantity: 1, price: 0.01 }], env)!
    const result = quoteCheckout(lines)
    assert.ok(result.ok && result.quote.totalCents === 2999)
  })
})

describe("payment verification", () => {
  const good = { status: "COMPLETED", amount_money: { amount: 2999, currency: "USD" }, location_id: "LOC" }
  it("accepts only an exact, completed payment at our location", () => {
    assert.equal(paymentMatchesQuote(good, 2999, "LOC"), true)
    assert.equal(paymentMatchesQuote({ ...good, status: "APPROVED" }, 2999, "LOC"), false)
    assert.equal(paymentMatchesQuote({ ...good, amount_money: { amount: 1, currency: "USD" } }, 2999, "LOC"), false)
    assert.equal(paymentMatchesQuote(good, 2999, "OTHER"), false)
  })

  it("hosting terms add 10 calendar years", () => {
    assert.equal(getHostingTerms([{ ships: true }], ORDER_DATE).hostingIncludedUntil, "2036-10-07T17:00:00.000Z")
  })
})

describe("create-payment route (Square mocked, sandbox base URL, fake credentials)", () => {
  const realFetch = globalThis.fetch
  const savedEnv = { ...process.env }
  afterEach(() => {
    globalThis.fetch = realFetch
    process.env = { ...savedEnv }
  })

  function mockSquare() {
    const calls: Array<{ url: string; body: any }> = []
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      assert.ok(url.startsWith("https://connect.squareupsandbox.com/"), `unexpected network call: ${url}`)
      const body = init?.body ? JSON.parse(String(init.body)) : null
      calls.push({ url, body })
      const json = (data: unknown) => new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json" } })
      if (url.endsWith("/v2/payments")) return json({ payment: { id: "PAY1", status: "COMPLETED" } })
      return new Response("{}", { status: 404 })
    }) as typeof fetch
    return calls
  }

  function setEnv(extra: Record<string, string>) {
    Object.assign(process.env, {
      SQUARE_ENVIRONMENT: "sandbox",
      SQUARE_ACCESS_TOKEN: "fake-test-token",
      SQUARE_LOCATION_ID: "LOC",
      ...extra,
    })
  }

  it("keepsake: one server-priced charge, no customer, card, or subscription", async () => {
    setEnv({ ...podEnv, SQUARE_SUBSCRIPTION_PLAN_ID: "PLANVAR123" })
    const calls = mockSquare()
    const { POST } = await import("../app/api/square/create-payment/route")
    const response = await POST(
      new Request("http://local/api/square/create-payment", {
        method: "POST",
        body: JSON.stringify({ sourceId: "cnon:ok", amount: 0.01, items: [{ id: "pet-tag", quantity: 1 }], customerEmail: "a@b.co" }),
      }),
    )
    const data = await response.json()
    assert.equal(data.success, true)
    assert.equal(data.cardId, undefined)
    assert.deepEqual(calls.map((c) => c.url.split("/v2/")[1]), ["payments"])
    assert.equal(calls[0].body.amount_money.amount, 2999, "client amount 0.01 is ignored")
    assert.equal(calls[0].body.customer_id, undefined)
  })

  it("the old monthly page id is refused before any charge", async () => {
    setEnv({ SQUARE_SUBSCRIPTION_PLAN_ID: "PLANVAR123" })
    const calls = mockSquare()
    const { POST } = await import("../app/api/square/create-payment/route")
    const response = await POST(
      new Request("http://local/api/square/create-payment", {
        method: "POST",
        body: JSON.stringify({ sourceId: "cnon:ok", items: [{ id: "digital-memorial", quantity: 1 }], customerEmail: "a@b.co" }),
      }),
    )
    assert.equal(response.status, 400)
    assert.equal(calls.length, 0)
  })
})
