export type LinePersonalization = {
  name: string
  birthDate: string | null
  deathDate: string | null
  message: string | null
  photoUrl: string | null
}

function dateOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null
  const date = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  return date
}

function httpsOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null
  const url = value.trim()
  if (!/^https:\/\/\S+$/i.test(url)) return null
  return url.slice(0, 2000)
}

/** Drops invalid fields. A line with no name is treated as not personalized. */
export function sanitizePersonalization(value: unknown): LinePersonalization | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  const name = typeof record.name === "string" ? record.name.trim().slice(0, 80) : ""
  if (!name) return null
  const message = typeof record.message === "string" ? record.message.trim().slice(0, 280) : ""
  return {
    name,
    birthDate: dateOrNull(record.birthDate),
    deathDate: dateOrNull(record.deathDate),
    message: message || null,
    photoUrl: httpsOrNull(record.photoUrl),
  }
}

/** One entry per cart line. Missing or invalid personalization becomes null. */
export function sanitizePersonalizationList(items: unknown): Array<LinePersonalization | null> {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    if (!item || typeof item !== "object" || !("personalization" in item)) return null
    return sanitizePersonalization((item as { personalization?: unknown }).personalization)
  })
}
