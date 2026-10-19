import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Short-lived proof that the browser that just created a memorial may add its
 * first photos/videos without waiting for approval (the creator may not be
 * signed in yet). Signed with a server-only secret; never exposes the secret.
 */
const TTL_SECONDS = 6 * 60 * 60

function secret(env: Record<string, string | undefined> = process.env): string | null {
  return env.MEDIA_UPLOAD_SECRET || env.SUPABASE_SERVICE_ROLE_KEY || null
}

function sign(memorialId: string, expires: number, key: string): string {
  return createHmac("sha256", key).update(`memorial-creator:${memorialId}:${expires}`).digest("base64url")
}

export function createCreatorToken(memorialId: string, now = Date.now(), env = process.env): string | null {
  const key = secret(env)
  if (!key) return null
  const expires = Math.floor(now / 1000) + TTL_SECONDS
  return `${expires}.${sign(memorialId, expires, key)}`
}

export function verifyCreatorToken(
  memorialId: string,
  token: string | null | undefined,
  now = Date.now(),
  env = process.env,
): boolean {
  const key = secret(env)
  if (!key || !token) return false
  const [expiresRaw, signature] = token.split(".")
  const expires = Number(expiresRaw)
  if (!Number.isFinite(expires) || !signature || expires < Math.floor(now / 1000)) return false
  const expected = new Uint8Array(Buffer.from(sign(memorialId, expires, key)))
  const given = new Uint8Array(Buffer.from(signature))
  return expected.length === given.length && timingSafeEqual(expected, given)
}
