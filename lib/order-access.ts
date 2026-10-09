/** Ownership checks for customer-facing order routes (no login required, so prove it with the order's email). */
export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

export function emailMatchesOrder(order: { customer_email?: string | null } | null | undefined, email: unknown): boolean {
  const given = normalizeEmail(email)
  const stored = normalizeEmail(order?.customer_email)
  return Boolean(given && stored && given === stored)
}

export type LinkDecision = { ok: true } | { ok: false; status: number; error: string }

export function decideMemorialLink(
  order: { customer_email?: string | null; memorial_id?: string | null } | null,
  memorialId: string,
  email: unknown,
): LinkDecision {
  if (!order || !emailMatchesOrder(order, email)) return { ok: false, status: 404, error: "Order not found" }
  if (order.memorial_id && order.memorial_id !== memorialId) {
    return { ok: false, status: 409, error: "This order is already linked to a memorial" }
  }
  return { ok: true }
}

const ADDONS = new Set(["wooden_qr", "picture_plaque", "stone_qr"])

export function parseCustomization(body: any):
  | { ok: true; value: { plaqueColor: string | null; boxPersonalization: string | null; addons: string[] } }
  | { ok: false; error: string } {
  const addons = Array.isArray(body?.addons) ? body.addons : []
  if (!addons.every((a: unknown) => typeof a === "string" && ADDONS.has(a))) return { ok: false, error: "Unknown add-on" }
  const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null)
  return { ok: true, value: { plaqueColor: str(body?.plaqueColor, 40), boxPersonalization: str(body?.boxPersonalization, 200), addons } }
}
