const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number]

export type ClickAttribution = Partial<Record<AttributionKey, string>>

const MAX_VALUE = 200

function cleanValue(value: string): string | null {
  const trimmed = value.replace(/[\u0000-\u001F\u007F]/g, "").trim()
  if (!trimmed) return null
  return trimmed.slice(0, MAX_VALUE)
}

export function parseAttribution(search: string): ClickAttribution | null {
  const query = search.startsWith("?") ? search.slice(1) : search
  const params = new URLSearchParams(query)
  const result: ClickAttribution = {}
  for (const key of ATTRIBUTION_KEYS) {
    const raw = params.get(key)
    if (raw == null) continue
    const clean = cleanValue(raw)
    if (clean) result[key] = clean
  }
  return Object.keys(result).length > 0 ? result : null
}

export function attributionFromUnknown(value: unknown): ClickAttribution | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  const params = new URLSearchParams()
  for (const key of ATTRIBUTION_KEYS) {
    const item = record[key]
    if (typeof item === "string") params.set(key, item)
  }
  return parseAttribution(params.toString())
}

/** Keep the first stored click. A later visit does not replace it. */
export function firstTouch(stored: ClickAttribution | null, incoming: ClickAttribution | null): ClickAttribution | null {
  if (stored && Object.keys(stored).length > 0) return stored
  return incoming
}

export function formatAttribution(value: ClickAttribution | null): string {
  if (!value) return ""
  return ATTRIBUTION_KEYS.flatMap((key) => (value[key] ? [`${key}=${value[key]}`] : [])).join("\n")
}
