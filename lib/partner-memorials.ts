import { SITE_URL } from "@/lib/site"

/**
 * Short links printed as QR codes on partner keepsakes (Custom Gifts Online / Tailkept).
 *
 * A printed code never changes. `/q/{code}` is resolved on every scan, so it can
 * point at the claim page today and at the finished memorial later.
 */

const CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"
const CODE_LENGTH = 10

/** Codes that are not order codes. `/q/sample` is the scannable preview QR on product pages. */
export const SAMPLE_CODE = "sample"
export const SAMPLE_DESTINATION = "/example-memorial"

export type PartnerCreateInput = {
  source: string
  orderId: string
  lineItemId: string
  petName: string
  birthDate: string | null
  deathDate: string | null
  photoUrl: string | null
  buyerEmail: string
}

export type ClaimDecision = "need_auth" | "mismatch" | "claim" | "already"

/** 10 characters from a 31-letter alphabet (no 0/o, 1/l/i). Rejection sampling keeps it uniform. */
export function newShortCode(random: (bytes: Uint8Array) => Uint8Array = (bytes) => crypto.getRandomValues(bytes)): string {
  const limit = 256 - (256 % CODE_ALPHABET.length)
  let code = ""
  while (code.length < CODE_LENGTH) {
    const bytes = random(new Uint8Array(CODE_LENGTH * 2))
    for (const byte of bytes) {
      if (byte >= limit) continue
      code += CODE_ALPHABET[byte % CODE_ALPHABET.length]
      if (code.length === CODE_LENGTH) break
    }
  }
  return code
}

export function isShortCode(value: string): boolean {
  return /^[a-z0-9-]{4,80}$/i.test(value)
}

export function scanUrl(code: string): string {
  return `${SITE_URL}/q/${code}`
}

export function claimPageUrl(code: string): string {
  return `${SITE_URL}/claim/${code}`
}

export function emailsMatch(left: string | null | undefined, right: string | null | undefined): boolean {
  if (!left || !right) return false
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

/** Constant-time string compare that does not throw when the lengths differ. */
export function secretsMatch(provided: string | null, secret: string | undefined): boolean {
  if (!provided || !secret) return false
  const length = Math.max(provided.length, secret.length)
  let mismatch = provided.length === secret.length ? 0 : 1
  for (let index = 0; index < length; index++) {
    mismatch |= (provided.charCodeAt(index) || 0) ^ (secret.charCodeAt(index) || 0)
  }
  return mismatch === 0
}

export function partnerSecretFromRequest(headers: Headers): string | null {
  const direct = headers.get("x-partner-secret")
  if (direct?.trim()) return direct.trim()
  const authorization = headers.get("authorization")
  if (!authorization) return null
  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim())
  return match ? match[1] : null
}

/** Only full ISO dates fit the memorials DATE columns. Anything else ("2012", "Spring 2012") is dropped, not rejected. */
function isoDateOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null
  const date = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  return Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ? null : date
}

function httpsOrNull(value: unknown): { ok: true; value: string | null } | { ok: false; error: string } {
  if (value == null || value === "") return { ok: true, value: null }
  if (typeof value !== "string" || !/^https:\/\/\S+$/i.test(value.trim())) {
    return { ok: false, error: "photoUrl must be an https URL" }
  }
  return { ok: true, value: value.trim() }
}

export function parsePartnerCreateBody(
  body: unknown,
): { ok: true; value: PartnerCreateInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "Expected a JSON object" }
  const record = body as Record<string, unknown>
  const source = typeof record.source === "string" ? record.source.trim().toLowerCase() : ""
  if (!/^[a-z0-9][a-z0-9_-]{0,40}$/.test(source)) {
    return { ok: false, error: "source must be a short slug such as tailkept" }
  }
  const orderId = typeof record.orderId === "string" ? record.orderId.trim() : ""
  if (!orderId || orderId.length > 80) return { ok: false, error: "orderId is required" }
  const lineItemRaw = typeof record.lineItemId === "string" ? record.lineItemId.trim() : ""
  if (lineItemRaw.length > 80) return { ok: false, error: "lineItemId is too long" }
  const petName = typeof record.petName === "string" ? record.petName.trim() : ""
  if (!petName || petName.length > 80) return { ok: false, error: "petName is required" }
  const buyerEmail = typeof record.buyerEmail === "string" ? record.buyerEmail.trim().toLowerCase() : ""
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) return { ok: false, error: "buyerEmail is required" }
  const photo = httpsOrNull(record.photoUrl)
  if (!photo.ok) return photo
  return {
    ok: true,
    value: {
      source,
      orderId,
      lineItemId: lineItemRaw,
      petName,
      birthDate: isoDateOrNull(record.birthDate),
      deathDate: isoDateOrNull(record.deathDate),
      photoUrl: photo.value,
      buyerEmail,
    },
  }
}

/** QR codes printed before short links use `/?ref=tailkept&order={id}`. */
export function legacyTailkeptOrder(url: URL): string | null {
  if (url.pathname !== "/") return null
  if (url.searchParams.get("ref") !== "tailkept") return null
  const order = url.searchParams.get("order")?.trim()
  return order ? order : null
}

export type ScanRow = { memorial_id: string | null; claimed_at: string | null } | null
export type ScanMemorial = { id: string; slug: string | null } | null

/**
 * Where a scan of `/q/{code}` goes right now.
 * Unclaimed: the claim page (shows the name and photo, and lets the buyer set it up).
 * Claimed: the memorial itself, by its current slug.
 */
export function scanDestination(code: string, row: ScanRow, memorial: ScanMemorial): string | null {
  if (code.toLowerCase() === SAMPLE_CODE) return SAMPLE_DESTINATION
  if (!row) return memorial ? `/memorial/${encodeURIComponent(memorial.slug || memorial.id)}` : null
  if (!row.claimed_at || !memorial) return `/claim/${encodeURIComponent(code)}`
  return `/memorial/${encodeURIComponent(memorial.slug || memorial.id)}`
}

export function claimDecision(input: {
  buyerEmail: string
  userEmail: string | null
  userId: string | null
  claimedBy: string | null
}): ClaimDecision {
  if (!input.userId || !input.userEmail) return "need_auth"
  if (!emailsMatch(input.userEmail, input.buyerEmail)) return "mismatch"
  if (input.claimedBy) return input.claimedBy === input.userId ? "already" : "mismatch"
  return "claim"
}

/** Only same-site relative paths are allowed after sign-in. */
export function safeNextPath(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null
  return next
}
