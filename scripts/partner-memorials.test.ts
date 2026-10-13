import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createPartnerMemorial, type PartnerDb } from "../lib/partner-memorial-store"
import {
  claimDecision,
  legacyTailkeptOrder,
  parsePartnerCreateBody,
  secretsMatch,
} from "../lib/partner-memorials"

const input = {
  source: "tailkept",
  orderId: "ord-1",
  lineItemId: "",
  petName: "Mabel",
  birthDate: null,
  deathDate: "2020-01-02",
  photoUrl: null,
  buyerEmail: "buyer@example.com",
}

function memoryDb(): PartnerDb & { memorials: Array<Record<string, unknown>> } {
  const codes: Array<Record<string, string>> = []
  const memorials: Array<Record<string, unknown>> = []
  const db: PartnerDb & { memorials: Array<Record<string, unknown>> } = {
    memorials,
    from(table: string) {
      const filters: Record<string, string> = {}
      const api = {
        select() {
          return api
        },
        eq(key: string, value: string) {
          filters[key] = value
          return api
        },
        maybeSingle: async () => {
          const found = codes.find((row) => Object.entries(filters).every(([key, value]) => row[key] === value))
          return { data: found ?? null, error: null }
        },
        insert(row: Record<string, unknown>) {
          return {
            select() {
              return {
                single: async () => {
                  if (table === "memorials") {
                    const id = `mem-${memorials.length + 1}`
                    memorials.push({ ...row, id })
                    return { data: { id }, error: null }
                  }
                  const duplicate = codes.some(
                    (code) =>
                      code.source === row.source &&
                      code.external_order_id === row.external_order_id &&
                      code.line_item_id === row.line_item_id,
                  )
                  if (duplicate) return { data: null, error: { code: "23505", message: "duplicate" } }
                  codes.push(row as Record<string, string>)
                  return { data: { code: row.code, memorial_id: row.memorial_id }, error: null }
                },
              }
            },
          }
        },
      }
      return api
    },
  }
  return db
}

describe("partner memorials", () => {
  it("parses a create body and rejects a bad email", () => {
    const parsed = parsePartnerCreateBody({
      source: "Tailkept",
      orderId: "ord-1",
      petName: "Mabel",
      buyerEmail: "Buyer@Example.com",
    })
    assert.equal(parsed.ok, true)
    if (parsed.ok) {
      assert.equal(parsed.value.source, "tailkept")
      assert.equal(parsed.value.buyerEmail, "buyer@example.com")
      assert.equal(parsed.value.lineItemId, "")
    }
    assert.equal(parsePartnerCreateBody({ source: "tailkept", orderId: "1", petName: "Mabel" }).ok, false)
  })

  it("matches secrets and only the homepage Tailkept order link", () => {
    assert.equal(secretsMatch("secret", "secret"), true)
    assert.equal(secretsMatch("secret", "secret2"), false)
    assert.equal(secretsMatch(null, "secret"), false)
    const hit = legacyTailkeptOrder(new URL("https://memorialsqr.com/?ref=tailkept&order=abc"))
    assert.equal(hit, "abc")
    assert.equal(legacyTailkeptOrder(new URL("https://memorialsqr.com/store?ref=tailkept&order=abc")), null)
    assert.equal(legacyTailkeptOrder(new URL("https://memorialsqr.com/?ref=other&order=abc")), null)
  })

  it("requires the buyer email before a claim", () => {
    assert.equal(
      claimDecision({ buyerEmail: "a@b.com", userEmail: null, userId: null, claimedBy: null }),
      "need_auth",
    )
    assert.equal(
      claimDecision({ buyerEmail: "a@b.com", userEmail: "other@b.com", userId: "user-1", claimedBy: null }),
      "mismatch",
    )
    assert.equal(
      claimDecision({ buyerEmail: "a@b.com", userEmail: "A@b.com", userId: "user-1", claimedBy: null }),
      "claim",
    )
    assert.equal(
      claimDecision({ buyerEmail: "a@b.com", userEmail: "a@b.com", userId: "user-1", claimedBy: "user-1" }),
      "already",
    )
  })

  it("creates one memorial per source and order, then returns the same code", async () => {
    const db = memoryDb()
    const sent: string[] = []
    const first = await createPartnerMemorial(db, input, async (mail) => {
      sent.push(mail.claimUrl)
    })
    const second = await createPartnerMemorial(db, input, async () => {
      throw new Error("should not email a replay")
    })
    assert.equal(first.created, true)
    assert.equal(first.emailSent, true)
    assert.equal(second.created, false)
    assert.equal(second.code, first.code)
    assert.match(first.url, /\/q\//)
    assert.equal(db.memorials.length, 1)
    assert.equal(db.memorials[0].partner_managed, true)
    assert.equal(db.memorials[0].user_id, null)
    assert.equal(sent.length, 1)
  })
})
