import { SITE_URL } from "@/lib/site"

const CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"

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

export function newShortCode(): string {
  const bytes = new Uint8Array(10)
  crypto.getRandomValues(bytes)
  let code = ""
  for (const byte of bytes) code += CODE_ALPHABET[byte % CODE_ALPHABET.length]
  return code
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

function dateOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null
  const date = value.trim()
  if (!date) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  return date
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
  if (!body || typeof body !== "object") return { ok: false, error: "Expected a JSON object" }
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
  if (record.birthDate != null && record.birthDate !== "" && !dateOrNull(record.birthDate)) {
    return { ok: false, error: "birthDate must be YYYY-MM-DD" }
  }
  if (record.deathDate != null && record.deathDate !== "" && !dateOrNull(record.deathDate)) {
    return { ok: false, error: "deathDate must be YYYY-MM-DD" }
  }
  const photo = httpsOrNull(record.photoUrl)
  if (!photo.ok) return photo
  return {
    ok: true,
    value: {
      source,
      orderId,
      lineItemId: lineItemRaw,
      petName,
      birthDate: dateOrNull(record.birthDate),
      deathDate: dateOrNull(record.deathDate),
      photoUrl: photo.value,
      buyerEmail,
    },
  }
}

/** Printed Tailkept QR codes use `/?ref=tailkept&order={id}`. */
export function legacyTailkeptOrder(url: URL): string | null {
  if (url.pathname !== "/") return null
  if (url.searchParams.get("ref") !== "tailkept") return null
  const order = url.searchParams.get("order")?.trim()
  return order ? order : null
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
