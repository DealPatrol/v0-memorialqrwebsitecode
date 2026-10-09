import { test } from "node:test"
import assert from "node:assert/strict"
import { decideMemorialLink, emailMatchesOrder, parseCustomization } from "../lib/order-access"

test("email must match the order (case/space-insensitive)", () => {
  assert.equal(emailMatchesOrder({ customer_email: "A@b.com" }, " a@B.com "), true)
  assert.equal(emailMatchesOrder({ customer_email: "a@b.com" }, "x@b.com"), false)
  assert.equal(emailMatchesOrder({ customer_email: null }, ""), false)
  assert.equal(emailMatchesOrder(null, "a@b.com"), false)
})

test("link-memorial refuses wrong email and re-linking", () => {
  assert.deepEqual(decideMemorialLink({ customer_email: "a@b.com", memorial_id: null }, "m1", "a@b.com"), { ok: true })
  assert.equal(decideMemorialLink({ customer_email: "a@b.com", memorial_id: null }, "m1", "z@b.com").ok, false)
  const relink = decideMemorialLink({ customer_email: "a@b.com", memorial_id: "m0" }, "m1", "a@b.com")
  assert.equal(relink.ok, false)
  assert.equal(decideMemorialLink({ customer_email: "a@b.com", memorial_id: "m1" }, "m1", "a@b.com").ok, true)
})

test("customization only accepts known add-ons", () => {
  assert.equal(parseCustomization({ addons: ["stone_qr"] }).ok, true)
  assert.equal(parseCustomization({ addons: ["free_stuff"] }).ok, false)
  assert.equal(parseCustomization({}).ok, true)
})
