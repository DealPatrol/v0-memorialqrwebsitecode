import { SITE_URL } from "@/lib/site"

export type MemorialLookupStatus = "found" | "missing" | "unknown"

export function classifyMemorialResponse(
  id: string,
  status: number | null,
  hasMemorial: boolean,
): MemorialLookupStatus {
  if (!id || id.startsWith("SAMPLE-")) return "missing"
  if (status === 404) return "missing"
  if (status === 200 && !hasMemorial) return "missing"
  if (status === 200 && hasMemorial) return "found"
  return "unknown"
}

export async function lookupMemorial(id: string): Promise<{
  status: MemorialLookupStatus
  memorial?: Record<string, unknown>
}> {
  if (!id || id.startsWith("SAMPLE-")) return { status: "missing" }
  try {
    const response = await fetch(`${SITE_URL}/api/memorials/${encodeURIComponent(id)}`, { cache: "no-store" })
    if (!response.ok) {
      return { status: classifyMemorialResponse(id, response.status, false) }
    }
    const payload = (await response.json()) as { memorial?: Record<string, unknown> }
    const memorial = payload.memorial
    return {
      status: classifyMemorialResponse(id, response.status, Boolean(memorial)),
      memorial,
    }
  } catch {
    return { status: "unknown" }
  }
}
