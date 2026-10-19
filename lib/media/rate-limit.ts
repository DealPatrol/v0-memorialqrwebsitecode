/**
 * Small sliding-window rate limiter. State lives in the function instance's
 * memory, so it is best-effort (each warm instance counts separately); the
 * per-memorial pending cap in lib/media/server.ts is the durable backstop.
 */
type Bucket = { hits: number[] }

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 5000

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number }

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const bucket = buckets.get(key) ?? { hits: [] }
  bucket.hits = bucket.hits.filter((time) => now - time < windowMs)
  if (bucket.hits.length >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - bucket.hits[0])) / 1000))
    buckets.set(key, bucket)
    return { ok: false, retryAfterSeconds }
  }
  bucket.hits.push(now)
  buckets.set(key, bucket)
  if (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value
    if (oldest !== undefined) buckets.delete(oldest)
  }
  return { ok: true }
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip")?.trim() || "unknown"
}

export function resetRateLimits() {
  buckets.clear()
}
