const PRIVATE_VISIBILITY = new Set(["private", "password", "unlisted", "restricted", "family", "hidden"])
const DRAFT_STATUS = new Set(["draft", "unpublished", "archived", "pending", "incomplete"])
const UNPAID_STATUS = new Set([
  "unpaid",
  "pending",
  "failed",
  "past_due",
  "canceled",
  "cancelled",
  "refunded",
  "incomplete",
  "inactive",
])
const PAID_STATUS = new Set(["paid", "completed", "active", "succeeded", "current"])

function textField(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === "string" && value.trim()) return value.trim().toLowerCase()
  }
  return ""
}

/**
 * A memorial is indexable only when it is explicitly public, not a draft, and paid.
 * Missing privacy or payment fields are treated as not indexable so private and unpaid
 * pages stay out of search.
 */
export function isIndexableMemorial(row: Record<string, unknown>): boolean {
  if (row.is_public === false || row.is_private === true || row.is_draft === true || row.published === false) {
    return false
  }
  if (row.is_paid === false || row.paid === false) return false

  const visibility = textField(row, ["visibility", "privacy", "privacy_setting", "access"])
  if (visibility && PRIVATE_VISIBILITY.has(visibility)) return false

  const status = textField(row, ["status", "publication_status", "publish_status"])
  if (status && DRAFT_STATUS.has(status)) return false

  const payment = textField(row, ["payment_status", "hosting_status", "subscription_status", "billing_status"])
  if (payment && UNPAID_STATUS.has(payment)) return false

  const explicitlyPublic = row.is_public === true || visibility === "public"
  const explicitlyPaid = row.is_paid === true || row.paid === true || PAID_STATUS.has(payment)

  return explicitlyPublic && explicitlyPaid
}

export function memorialPublicPath(row: Record<string, unknown>): string | null {
  const slug = typeof row.slug === "string" ? row.slug.trim() : ""
  const id = typeof row.id === "string" ? row.id.trim() : ""
  const key = slug || id
  if (!key) return null
  return `/memorial/${key}`
}
