import assert from "node:assert/strict"
import { test } from "node:test"
import { adminEmails, isAdminEmail } from "../lib/admin-emails"

test("admin list merges ADMIN_EMAILS, ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_EMAIL", () => {
  const env = { ADMIN_EMAILS: "A@x.com, b@y.com", ADMIN_EMAIL: "c@z.com", NEXT_PUBLIC_ADMIN_EMAIL: "a@x.com" }
  assert.deepEqual(adminEmails(env), ["a@x.com", "b@y.com", "c@z.com"])
  assert.equal(isAdminEmail("B@Y.com", env), true)
  assert.equal(isAdminEmail("someone@else.com", env), false)
})

test("no admin env means nobody is an admin", () => {
  assert.deepEqual(adminEmails({}), [])
  assert.equal(isAdminEmail("anyone@x.com", {}), false)
  assert.equal(isAdminEmail(null, { ADMIN_EMAIL: "a@x.com" }), false)
})
