/**
 * Logic-only checks for the $4.99/month digital page and keepsake hosting.
 * Every Square call is answered by a local mock; no network request and no card charge.
 * Run: pnpm test:checkout
 */
import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { DIGITAL_MEMORIAL, POD_PRODUCTS } from "../lib/catalog"
import { resolveConfiguredCheckoutItems, listSellableProducts, memorialStartHref } from "../lib/fulfillment-availability"
import { paymentMatchesQuote, quoteCheckout } from "../lib/checkout-quote"
import { getHostingTerms } from "../lib/hosting"
import { subscriptionStartDate } from "../lib/square-api"

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
  it("physical keepsakes carry no monthly fee and 10 included years", () => {
    for (const product of POD_PRODUCTS) {
      assert.equal(product.monthlyFee, 0, product.id)
      assert.equal(product.hostingIncludedYears, 10, product.id)
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

describe("digital page availability", () => {
  it("is hidden and rejected without SQUARE_SUBSCRIPTION_PLAN_ID", () => {
    assert.ok(!listSellableProducts({}).some((p) => p.id === DIGITAL_MEMORIAL.id))
    assert.equal(resolveConfiguredCheckoutItems([{ id: "digital-memorial", quantity: 1 }], {}), null)
    assert.equal(memorialStartHref({}), "/create-memorial")
  })

  it("is sold, and Create a Memorial Page opens checkout, once the plan id is set", () => {
    const env = { SQUARE_SUBSCRIPTION_PLAN_ID: "PLANVAR123" }
    assert.ok(listSellableProducts(env).some((p) => p.id === DIGITAL_MEMORIAL.id))
    assert.equal(memorialStartHref(env), "/checkout/simple?product=digital-memorial")
    const lines = resolveConfiguredCheckoutItems([{ id: "digital-memorial", quantity: 1 }], env)
    assert.ok(lines)
    assert.equal(lines[0].price, 4.99)
  })
})

describe("quoteCheckout", () => {
  const env = { ...podEnv, SQUARE_SUBSCRIPTION_PLAN_ID: "PLANVAR123" }

  it("digital page: charges the first month and needs a subscription", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "digital-memorial", quantity: 1 }], env)!
    const result = quoteCheckout(lines, ORDER_DATE)
    assert.ok(result.ok)
    assert.equal(result.quote.totalCents, 499)
    assert.equal(result.quote.needsSubscription, true)
    assert.equal(result.quote.monthlyAmountCents, 499)
    assert.equal(result.quote.hostingTerms.hostingIncludedUntil, null)
  })

  it("physical keepsake: no subscription, hosting included for 10 years", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "pet-tag", quantity: 2 }], env)!
    const result = quoteCheckout(lines, ORDER_DATE)
    assert.ok(result.ok)
    assert.equal(result.quote.totalCents, 2 * 2999)
    assert.equal(result.quote.needsSubscription, false)
    assert.equal(result.quote.monthlyAmountCents, 0)
    assert.equal(result.quote.hostingTerms.hostingIncludedUntil, "2036-10-07T17:00:00.000Z")
  })

  it("concierge alone bills monthly; concierge with a keepsake does not", () => {
    const solo = quoteCheckout(resolveConfiguredCheckoutItems([{ id: "concierge-digital", quantity: 1 }], env)!, ORDER_DATE)
    assert.ok(solo.ok && solo.quote.needsSubscription && solo.quote.totalCents === 29999)
    const mixed = quoteCheckout(
      resolveConfiguredCheckoutItems([{ id: "concierge-digital", quantity: 1 }, { id: "keep-card", quantity: 1 }], env)!,
      ORDER_DATE,
    )
    assert.ok(mixed.ok && !mixed.quote.needsSubscription && mixed.quote.hostingTerms.includesPhysicalKeepsake)
  })

  it("rejects a monthly page bundled with a keepsake, or more than one page", () => {
    const bundled = quoteCheckout(
      resolveConfiguredCheckoutItems([{ id: "digital-memorial", quantity: 1 }, { id: "pet-tag", quantity: 1 }], env)!,
    )
    assert.equal(bundled.ok, false)
    const two = quoteCheckout(resolveConfiguredCheckoutItems([{ id: "digital-memorial", quantity: 2 }], env)!)
    assert.equal(two.ok, false)
  })

  it("never trusts a client price", () => {
    const lines = resolveConfiguredCheckoutItems([{ id: "pet-tag", quantity: 1, price: 0.01 }], env)!
    const result = quoteCheckout(lines)
    assert.ok(result.ok && result.quote.totalCents === 2999)
  })
})

describe("payment verification", () => {
  const good = { status: "COMPLETED", amount_money: { amount: 499, currency: "USD" }, location_id: "LOC" }
  it("accepts only an exact, completed payment at our location", () => {
    assert.equal(paymentMatchesQuote(good, 499, "LOC"), true)
    assert.equal(paymentMatchesQuote({ ...good, status: "APPROVED" }, 499, "LOC"), false)
    assert.equal(paymentMatchesQuote({ ...good, amount_money: { amount: 1, currency: "USD" } }, 499, "LOC"), false)
    assert.equal(paymentMatchesQuote(good, 499, "OTHER"), false)
  })
})

describe("subscription dates", () => {
  it("starts billing one month after checkout, clamped to month end", () => {
    assert.equal(subscriptionStartDate(new Date("2026-10-07T12:00:00Z")), "2026-11-07")
    assert.equal(subscriptionStartDate(new Date("2026-01-31T12:00:00Z")), "2026-02-28")
    assert.equal(subscriptionStartDate(new Date("2028-01-31T12:00:00Z")), "2028-02-29")
    assert.equal(subscriptionStartDate(new Date("2026-12-15T12:00:00Z")), "2027-01-15")
  })

  it("hosting terms add 10 calendar years", () => {
    assert.equal(getHostingTerms([{ hostingIncludedYears: 10 }], ORDER_DATE).hostingIncludedUntil, "2036-10-07T17:00:00.000Z")
    assert.equal(getHostingTerms([{}], ORDER_DATE).monthlyAmountCents, 499)
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
      if (url.endsWith("/v2/customers")) return json({ customer: { id: "CUST1" } })
      if (url.endsWith("/v2/payments")) return json({ payment: { id: "PAY1", status: "COMPLETED", customer_id: body.customer_id } })
      if (url.endsWith("/v2/cards")) return json({ card: { id: "CARD1", customer_id: body.card.customer_id } })
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

  it("digital page: customer, then server-priced charge, then card saved from the payment id", async () => {
    setEnv({ SQUARE_SUBSCRIPTION_PLAN_ID: "PLANVAR123" })
    const calls = mockSquare()
    const { POST } = await import("../app/api/square/create-payment/route")
    const response = await POST(
      new Request("http://local/api/square/create-payment", {
        method: "POST",
        body: JSON.stringify({
          sourceId: "cnon:card-nonce-ok",
          verificationToken: "verf",
          amount: 0.01,
          items: [{ id: "digital-memorial", quantity: 1 }],
          customerEmail: "family@example.com",
          customerName: "",
        }),
      }),
    )
    const data = await response.json()
    assert.equal(data.success, true)
    assert.equal(data.cardId, "CARD1")
    assert.deepEqual(calls.map((c) => c.url.replace("https://connect.squareupsandbox.com", "")), ["/v2/customers", "/v2/payments", "/v2/cards"])
    assert.equal(calls[1].body.amount_money.amount, 499, "client amount 0.01 is ignored")
    assert.equal(calls[1].body.customer_id, "CUST1")
    assert.equal(calls[2].body.source_id, "PAY1", "card is saved from the payment, not the single-use token")
  })

  it("keepsake: one charge, no customer or card for a subscription", async () => {
    setEnv({ ...podEnv })
    const calls = mockSquare()
    const { POST } = await import("../app/api/square/create-payment/route")
    const response = await POST(
      new Request("http://local/api/square/create-payment", {
        method: "POST",
        body: JSON.stringify({ sourceId: "cnon:ok", items: [{ id: "pet-tag", quantity: 1 }], customerEmail: "a@b.co" }),
      }),
    )
    const data = await response.json()
    assert.equal(data.success, true)
    assert.equal(data.cardId, null)
    assert.deepEqual(calls.map((c) => c.url.split("/v2/")[1]), ["payments"])
    assert.equal(calls[0].body.amount_money.amount, 2999)
  })

  it("digital page without a plan id is refused before any charge", async () => {
    setEnv({})
    delete process.env.SQUARE_SUBSCRIPTION_PLAN_ID
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
