import { isKeepsakeComingSoon } from "@/lib/catalog"

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/

export type WaitlistInput = { email: string; productId: string; sourcePath: string | null }

export function normalizeWaitlistEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Same rule the waitlist API uses. Null means the address can be saved. */
export function waitlistEmailError(email: string): string | null {
  const value = normalizeWaitlistEmail(email)
  if (!EMAIL.test(value) || value.length > 254) return "Enter a valid email address"
  return null
}

export function parseWaitlistInput(
  body: unknown,
  env: Record<string, string | undefined> = process.env,
): { ok: true; value: WaitlistInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request" }
  const b = body as Record<string, unknown>
  const email = typeof b.email === "string" ? normalizeWaitlistEmail(b.email) : ""
  const emailError = typeof b.email === "string" ? waitlistEmailError(b.email) : "Enter a valid email address"
  if (emailError) return { ok: false, error: emailError }
  const productId = typeof b.productId === "string" ? b.productId : ""
  if (!isKeepsakeComingSoon(productId, env)) return { ok: false, error: "This keepsake does not have a waitlist" }
  const raw = typeof b.sourcePath === "string" ? b.sourcePath : ""
  const sourcePath = raw.startsWith("/") ? raw.slice(0, 200) : null
  return { ok: true, value: { email, productId, sourcePath } }
}
