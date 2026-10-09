import assert from "node:assert/strict"
import { test } from "node:test"
import { priceCart } from "../lib/checkout-pricing"
import { verifySquarePayment } from "../lib/square-verify"
import { manualFulfillmentRecipients, sendManualFulfillmentNotice } from "../lib/manual-fulfillment-email"
import { emailAlertsOf, mergeEmailAlert } from "../lib/order-email-alerts"
import { PET_MEMORIAL_PLAQUE_ID } from "../lib/catalog"

const env = { SQUARE_ACCESS_TOKEN: "test-token", SQUARE_LOCATION_ID: "LOC1", SQUARE_ENVIRONMENT: "sandbox" }

function fakeFetch(status: number, payment: Record<string, unknown> | null) {
  return async () => ({ ok: status >= 200 && status < 300, status, json: async () => (payment ? { payment } : {}) })
}
const good = { id: "pay_12345678", status: "COMPLETED", location_id: "LOC1", amount_money: { amount: 5998, currency: "USD" } }

test("cart is priced from the catalog, not the browser", () => {
  const cart = priceCart([{ id: PET_MEMORIAL_PLAQUE_ID, quantity: 2, price: 0.01 }], {})
  assert.ok(cart)
  assert.equal(cart.amountCents, 5998)
  assert.equal(cart.currency, "USD")
  assert.equal(priceCart([{ id: "not-a-product" }], {}), null)
  assert.equal(priceCart([], {}), null)
  assert.equal(priceCart([{ id: PET_MEMORIAL_PLAQUE_ID, quantity: 0 }], {}), null)
})

test("a COMPLETED payment for the exact amount, currency and location is accepted", async () => {
  const result = await verifySquarePayment("pay_12345678", { amountCents: 5998, currency: "USD" }, env, fakeFetch(200, good))
  assert.equal(result.ok, true)
})

test("unpaid, mismatched, foreign, or missing payments are rejected", async () => {
  const expected = { amountCents: 5998, currency: "USD" }
  const cases: [string, Record<string, unknown> | null, number][] = [
    ["approved only", { ...good, status: "APPROVED" }, 200],
    ["wrong amount", { ...good, amount_money: { amount: 1, currency: "USD" } }, 200],
    ["wrong currency", { ...good, amount_money: { amount: 5998, currency: "CAD" } }, 200],
    ["other location", { ...good, location_id: "LOC2" }, 200],
    ["other id", { ...good, id: "pay_other999" }, 200],
    ["not found", null, 404],
  ]
  for (const [name, payment, status] of cases) {
    const result = await verifySquarePayment("pay_12345678", expected, env, fakeFetch(status, payment))
    assert.equal(result.ok, false, name)
  }
  assert.equal((await verifySquarePayment("../x", expected, env, fakeFetch(200, good))).ok, false)
  assert.equal((await verifySquarePayment("pay_12345678", expected, {}, fakeFetch(200, good))).ok, false)
})

test("order alerts go to support, ADMIN_EMAIL and ORDER_ALERT_EMAIL once each", () => {
  const to = manualFulfillmentRecipients({ ADMIN_EMAIL: "service@memorialsqr.com", ORDER_ALERT_EMAIL: "owner@gmail.com, SERVICE@memorialsqr.com" })
  assert.deepEqual(to, ["support@memorialsqr.com", "service@memorialsqr.com", "owner@gmail.com"])
})

test("one rejected recipient does not block the others, and the failure is reported", async () => {
  const sent: string[] = []
  const result = await sendManualFulfillmentNotice(
    {
      order: {
        order_number: "MQR-TEST",
        customer_name: "A",
        customer_email: "a@example.com",
        customer_phone: null,
        shipping_address_line1: "1 Main",
        shipping_address_line2: null,
        shipping_city: "Town",
        shipping_state: "AL",
        shipping_zip: "35000",
        special_instructions: null,
      },
      lines: [],
      memorialUrl: null,
      printFileUrl: null,
      memorialError: null,
    },
    { ORDER_ALERT_EMAIL: "owner@gmail.com", RESEND_FROM_EMAIL: "Memorial QR <onboarding@resend.dev>" },
    async (message) => {
      sent.push(message.to[0])
      return message.to[0] === "owner@gmail.com" ? { error: null } : { error: { message: "testing sender can only send to the owner" } }
    },
  )
  assert.deepEqual(sent, ["support@memorialsqr.com", "owner@gmail.com"])
  assert.equal(result.sent, true)
  assert.deepEqual(result.delivered, ["owner@gmail.com"])
  assert.equal(result.failed.length, 1)
  assert.match(result.error || "", /support@memorialsqr.com/)
})

test("email alerts merge into fulfillment_data without dropping it", () => {
  const merged = mergeEmailAlert({ attribution: { gclid: "x" } }, { kind: "customer_confirmation", error: "boom", at: "now" })
  assert.deepEqual((merged as { attribution: unknown }).attribution, { gclid: "x" })
  assert.equal(emailAlertsOf(merged).length, 1)
  assert.equal(emailAlertsOf(mergeEmailAlert(merged, { kind: "manual_fulfillment_notice", error: "b", at: "t" })).length, 2)
  assert.deepEqual(emailAlertsOf(null), [])
})
