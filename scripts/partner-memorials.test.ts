import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createPartnerMemorial, type PartnerDb } from "../lib/partner-memorial-store"
import {
  claimDecision,
  legacyTailkeptOrder,
  newShortCode,
  parsePartnerCreateBody,
  partnerSecretFromRequest,
  safeNextPath,
  scanDestination,
  scanUrl,
  secretsMatch,
} from "../lib/partner-memorials"
import { shouldNoindexPath } from "../lib/request-indexing"

const input = {
  source: "tailkept",
  orderId: "ord-1",
  lineItemId: "0",
  petName: "Mabel",
  birthDate: null,
  deathDate: "2020-01-02",
  photoUrl: null,
  buyerEmail: "buyer@example.com",
}

type Row = Record<string, unknown>

/** Just enough of the Supabase query builder for the store, with unique constraints like the real tables. */
function memoryDb(): PartnerDb & { memorials: Row[]; codes: Row[] } {
  const codes: Row[] = []
  const memorials: Row[] = []
  const tables: Record<string, Row[]> = { partner_memorial_codes: codes, memorials }
  const unique: Record<string, string[][]> = {
    partner_memorial_codes: [["code"], ["source", "external_order_id", "line_item_id"]],
    memorials: [["slug"]],
  }
  return {
    memorials,
    codes,
    from(table: string) {
      const rows = tables[table]
      const filters: Array<[string, unknown]> = []
      const matches = (row: Row) => filters.every(([key, value]) => row[key] === value)
      const api = {
        select: () => api,
        eq(key: string, value: unknown) {
          filters.push([key, value])
          return api
        },
        maybeSingle: async () => ({ data: rows.find(matches) ?? null, error: null }),
        delete: () => ({
          eq: async (key: string, value: unknown) => {
            for (let index = rows.length - 1; index >= 0; index--) if (rows[index][key] === value) rows.splice(index, 1)
            return { error: null }
          },
        }),
        insert: (row: Row) => ({
          select: () => ({
            single: async () => {
              const clash = unique[table].some((keys) => rows.some((other) => keys.every((key) => other[key] === row[key])))
              if (clash) return { data: null, error: { code: "23505", message: "duplicate key" } }
              const saved = table === "memorials" ? { ...row, id: `mem-${memorials.length + 1}-${row.slug}` } : { ...row }
              rows.push(saved)
              return { data: saved, error: null }
            },
          }),
        }),
      }
      return api
    },
  }
}

describe("partner memorial body", () => {
  it("normalizes source and email and keeps the line item", () => {
    const parsed = parsePartnerCreateBody({
      source: "Tailkept",
      orderId: "ord-1",
      lineItemId: "2",
      petName: "Mabel",
      buyerEmail: "Buyer@Example.com",
    })
    assert.equal(parsed.ok, true)
    if (!parsed.ok) return
    assert.equal(parsed.value.source, "tailkept")
    assert.equal(parsed.value.buyerEmail, "buyer@example.com")
    assert.equal(parsed.value.lineItemId, "2")
  })

  it("drops non-ISO dates from the storefront instead of failing the order", () => {
    const parsed = parsePartnerCreateBody({
      source: "tailkept",
      orderId: "ord-1",
      petName: "Mabel",
      buyerEmail: "a@b.com",
      birthDate: "2012",
      deathDate: "2024-03-04",
    })
    assert.equal(parsed.ok, true)
    if (!parsed.ok) return
    assert.equal(parsed.value.birthDate, null)
    assert.equal(parsed.value.deathDate, "2024-03-04")
  })

  it("rejects a missing email, name, or a non-https photo", () => {
    assert.equal(parsePartnerCreateBody({ source: "tailkept", orderId: "1", petName: "Mabel" }).ok, false)
    assert.equal(parsePartnerCreateBody({ source: "tailkept", orderId: "1", buyerEmail: "a@b.com" }).ok, false)
    assert.equal(
      parsePartnerCreateBody({ source: "tailkept", orderId: "1", petName: "M", buyerEmail: "a@b.com", photoUrl: "http://x" }).ok,
      false,
    )
    assert.equal(parsePartnerCreateBody([]).ok, false)
  })
})

describe("partner secret", () => {
  it("compares in constant time and reads both header styles", () => {
    assert.equal(secretsMatch("secret", "secret"), true)
    assert.equal(secretsMatch("secret", "secret2"), false)
    assert.equal(secretsMatch(null, "secret"), false)
    assert.equal(secretsMatch("secret", undefined), false)
    assert.equal(partnerSecretFromRequest(new Headers({ "x-partner-secret": " s1 " })), "s1")
    assert.equal(partnerSecretFromRequest(new Headers({ authorization: "Bearer s2" })), "s2")
    assert.equal(partnerSecretFromRequest(new Headers({ authorization: "Basic s2" })), null)
  })
})

describe("short codes", () => {
  it("are 10 unambiguous characters and print as memorialsqr.com/q/{code}", () => {
    const seen = new Set<string>()
    for (let index = 0; index < 500; index++) {
      const code = newShortCode()
      assert.match(code, /^[abcdefghjkmnpqrstuvwxyz23456789]{10}$/)
      seen.add(code)
    }
    assert.equal(seen.size, 500)
    assert.equal(scanUrl("abc234defg"), "https://memorialsqr.com/q/abc234defg")
  })
})

describe("createPartnerMemorial", () => {
  it("creates one placeholder per order line and returns the same code on retry", async () => {
    const db = memoryDb()
    const first = await createPartnerMemorial(db, input)
    const second = await createPartnerMemorial(db, input)
    assert.equal(first.created, true)
    assert.equal(second.created, false)
    assert.equal(second.code, first.code)
    assert.equal(first.url, `https://memorialsqr.com/q/${first.code}`)
    assert.equal(first.claimUrl, `https://memorialsqr.com/claim/${first.code}`)
    assert.equal(db.memorials.length, 1)
    assert.equal(db.memorials[0].partner_managed, true)
    assert.equal(db.memorials[0].user_id, null)
    assert.equal(db.memorials[0].slug, first.code)
  })

  it("gives each line of a multi-ornament order its own code", async () => {
    const db = memoryDb()
    const a = await createPartnerMemorial(db, { ...input, lineItemId: "0" })
    const b = await createPartnerMemorial(db, { ...input, lineItemId: "1", petName: "Otis" })
    assert.notEqual(a.code, b.code)
    assert.equal(db.codes.length, 2)
  })

  it("does not email the buyer unless asked; the store sends its own order email", async () => {
    const db = memoryDb()
    const sent: string[] = []
    const quiet = await createPartnerMemorial(db, input, { sender: async (mail) => void sent.push(mail.to) })
    assert.equal(quiet.emailSent, false)
    assert.equal(sent.length, 0)
    const loud = await createPartnerMemorial(db, { ...input, lineItemId: "9" }, {
      notifyBuyer: true,
      sender: async (mail) => void sent.push(mail.to),
    })
    assert.equal(loud.emailSent, true)
    assert.deepEqual(sent, ["buyer@example.com"])
  })

  it("retries with a new code when a code or slug is already taken, and cleans up", async () => {
    const db = memoryDb()
    db.memorials.push({ id: "existing", slug: "takenslug1" })
    const codes = ["takenslug1", "freshcode2"]
    const result = await createPartnerMemorial(db, input, { newCode: () => codes.shift() as string })
    assert.equal(result.code, "freshcode2")
    assert.equal(db.memorials.length, 2)
  })
})

describe("scan destination", () => {
  const memorial = { id: "mem-1", slug: "abc234defg" }
  it("sends the sample code to the example memorial", () => {
    assert.equal(scanDestination("sample", null, null), "/example-memorial")
  })
  it("sends an unclaimed code to its claim page", () => {
    assert.equal(scanDestination("abc234defg", { memorial_id: "mem-1", claimed_at: null }, memorial), "/claim/abc234defg")
  })
  it("sends a claimed code to the memorial by its current slug", () => {
    assert.equal(
      scanDestination("abc234defg", { memorial_id: "mem-1", claimed_at: "2026-11-14T00:00:00Z" }, { id: "mem-1", slug: "mabel" }),
      "/memorial/mabel",
    )
  })
  it("falls back to a memorial whose slug is the code, else not found", () => {
    assert.equal(scanDestination("glenda-kelso", null, { id: "x", slug: "glenda-kelso" }), "/memorial/glenda-kelso")
    assert.equal(scanDestination("nope123456", null, null), null)
  })
})

describe("legacy links and safety", () => {
  it("only matches the homepage Tailkept order link", () => {
    assert.equal(legacyTailkeptOrder(new URL("https://memorialsqr.com/?ref=tailkept&order=abc")), "abc")
    assert.equal(legacyTailkeptOrder(new URL("https://memorialsqr.com/store?ref=tailkept&order=abc")), null)
    assert.equal(legacyTailkeptOrder(new URL("https://memorialsqr.com/?ref=other&order=abc")), null)
    assert.equal(legacyTailkeptOrder(new URL("https://memorialsqr.com/?ref=tailkept")), null)
  })

  it("requires the order email before a claim", () => {
    assert.equal(claimDecision({ buyerEmail: "a@b.com", userEmail: null, userId: null, claimedBy: null }), "need_auth")
    assert.equal(claimDecision({ buyerEmail: "a@b.com", userEmail: "o@b.com", userId: "u1", claimedBy: null }), "mismatch")
    assert.equal(claimDecision({ buyerEmail: "a@b.com", userEmail: "A@b.com", userId: "u1", claimedBy: null }), "claim")
    assert.equal(claimDecision({ buyerEmail: "a@b.com", userEmail: "a@b.com", userId: "u1", claimedBy: "u1" }), "already")
    assert.equal(claimDecision({ buyerEmail: "a@b.com", userEmail: "a@b.com", userId: "u2", claimedBy: "u1" }), "mismatch")
  })

  it("only follows same-site paths after sign-in", () => {
    assert.equal(safeNextPath("/claim/abc"), "/claim/abc")
    assert.equal(safeNextPath("//evil.example"), null)
    assert.equal(safeNextPath("https://evil.example"), null)
    assert.equal(safeNextPath("/\\evil"), null)
  })

  it("keeps short links and claim pages out of search", () => {
    assert.equal(shouldNoindexPath("/q/abc234defg"), true)
    assert.equal(shouldNoindexPath("/claim/abc234defg"), true)
  })
})

describe("POST /api/partner/memorials", () => {
  const body = JSON.stringify({ source: "tailkept", orderId: "o1", petName: "Mabel", buyerEmail: "a@b.com" })
  const call = async (headers: Record<string, string>, payload = body) => {
    const { POST } = await import("../app/api/partner/memorials/route")
    return POST(new Request("https://memorialsqr.com/api/partner/memorials", { method: "POST", headers, body: payload }))
  }

  it("is closed when PARTNER_API_SECRET is not set", async () => {
    delete process.env.PARTNER_API_SECRET
    assert.equal((await call({ "x-partner-secret": "anything" })).status, 503)
  })

  it("rejects a wrong secret and a bad body before touching the database", async () => {
    process.env.PARTNER_API_SECRET = "test-secret"
    assert.equal((await call({})).status, 401)
    assert.equal((await call({ "x-partner-secret": "wrong" })).status, 401)
    assert.equal((await call({ "x-partner-secret": "test-secret" }, "{")).status, 400)
    assert.equal((await call({ authorization: "Bearer test-secret" }, JSON.stringify({ source: "tailkept" }))).status, 400)
    delete process.env.PARTNER_API_SECRET
  })
})
