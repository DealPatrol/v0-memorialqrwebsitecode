import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { isAdminEmail } from "@/lib/admin-emails"
import { verifyCreatorToken } from "@/lib/media/creator-token"
import { isUuid, type ModerationStatus } from "@/lib/media/shared"

export type MediaTable = "photos" | "videos" | "music"

export const URL_COLUMN: Record<MediaTable, "image_url" | "video_url" | "audio_url"> = {
  photos: "image_url",
  videos: "video_url",
  music: "audio_url",
}

/** Columns added by scripts/031_media_kind_and_moderation.sql. Older databases lack them. */
const EXTENDED_COLUMNS = ["status", "kind", "is_youtube", "youtube_id", "uploaded_by", "original_url", "content_type", "size_bytes"]

/** Cap on items waiting for approval per memorial in 24h, so a page cannot be flooded. */
export const PENDING_CAP_PER_DAY = 60

export type MemorialRef = { id: string; slug: string; user_id: string | null; full_name: string }

export async function resolveMemorial(identifier: string, db: SupabaseClient = createServiceRoleClient()) {
  if (!identifier) return null
  const { data, error } = await db
    .from("memorials")
    .select("id, slug, user_id, full_name")
    .eq(isUuid(identifier) ? "id" : "slug", identifier)
    .maybeSingle()
  if (error) throw new Error(`Memorial lookup failed: ${error.message}`)
  return (data as MemorialRef | null) ?? null
}

export type Uploader = {
  userId: string | null
  email: string | null
  /** Memorial owner, site admin, or the browser that just created the memorial. */
  canPublish: boolean
}

export async function currentUploader(memorial: MemorialRef, creatorToken?: string | null): Promise<Uploader> {
  let userId: string | null = null
  let email: string | null = null
  let admin = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId = user?.id ?? null
    email = user?.email ?? null
    admin = Boolean(user?.email_confirmed_at && isAdminEmail(user?.email))
  } catch {
    // Signed-out visitors are fine; they just cannot publish without approval.
  }
  const owner = Boolean(userId && memorial.user_id && userId === memorial.user_id)
  const creator = verifyCreatorToken(memorial.id, creatorToken)
  return { userId, email, canPublish: owner || admin || creator }
}

/** Whether the signed-in visitor may approve or reject media on this memorial. */
export async function canModerate(memorial: MemorialRef): Promise<boolean> {
  const uploader = await currentUploader(memorial)
  return uploader.canPublish
}

function isMissingColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return error.code === "PGRST204" || error.code === "42703" || /column .* does not exist|schema cache/i.test(error.message ?? "")
}

/**
 * Insert a media row. If the moderation/kind migration has not been applied yet,
 * retry with only the original columns so uploads keep working (they are then
 * shown immediately, as before). `moderated` says which path was used.
 */
export async function insertMediaRow(
  table: MediaTable,
  row: Record<string, unknown>,
  db: SupabaseClient = createServiceRoleClient(),
): Promise<{ row: Record<string, any>; moderated: boolean }> {
  const first = await db.from(table).insert(row).select().single()
  if (!first.error) return { row: first.data, moderated: "status" in row }
  if (!isMissingColumn(first.error)) throw new Error(first.error.message)

  const legacy = Object.fromEntries(Object.entries(row).filter(([key]) => !EXTENDED_COLUMNS.includes(key)))
  const second = await db.from(table).insert(legacy).select().single()
  if (second.error) throw new Error(second.error.message)
  return { row: second.data, moderated: false }
}

export async function updateMediaRow(
  table: MediaTable,
  id: string,
  changes: Record<string, unknown>,
  db: SupabaseClient = createServiceRoleClient(),
) {
  const first = await db.from(table).update(changes).eq("id", id).select().maybeSingle()
  if (!first.error) return first.data
  if (!isMissingColumn(first.error)) throw new Error(first.error.message)
  const legacy = Object.fromEntries(Object.entries(changes).filter(([key]) => !EXTENDED_COLUMNS.includes(key)))
  if (Object.keys(legacy).length === 0) return null
  const second = await db.from(table).update(legacy).eq("id", id).select().maybeSingle()
  if (second.error) throw new Error(second.error.message)
  return second.data
}

/** Approved media for public pages. Falls back to all rows on databases without a status column. */
export async function selectPublicMedia(
  table: MediaTable,
  memorialId: string,
  { limit = 100, ascending = false }: { limit?: number; ascending?: boolean } = {},
  db: SupabaseClient = createServiceRoleClient(),
): Promise<Record<string, any>[]> {
  const base = () => db.from(table).select("*").eq("memorial_id", memorialId).order("created_at", { ascending }).limit(limit)
  const filtered = await base().eq("status", "approved")
  if (!filtered.error) return filtered.data ?? []
  if (!isMissingColumn(filtered.error)) throw new Error(filtered.error.message)
  const all = await base()
  if (all.error) throw new Error(all.error.message)
  return all.data ?? []
}

/** Pending media for one memorial (or every memorial when memorialId is null). Empty on unmigrated databases. */
export async function selectPendingMedia(memorialId: string | null, db: SupabaseClient = createServiceRoleClient()) {
  const tables: MediaTable[] = ["photos", "videos", "music"]
  const results = await Promise.all(
    tables.map(async (table) => {
      let query = db.from(table).select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(200)
      if (memorialId) query = query.eq("memorial_id", memorialId)
      const { data, error } = await query
      if (error) {
        if (isMissingColumn(error)) return []
        throw new Error(error.message)
      }
      return (data ?? []).map((row) => ({ ...row, table }))
    }),
  )
  return results.flat().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}

/** True when the memorial already has too many items waiting for approval today. */
export async function pendingCapReached(memorialId: string, db: SupabaseClient = createServiceRoleClient()) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  let total = 0
  for (const table of ["photos", "videos", "music"] as MediaTable[]) {
    const { count, error } = await db
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("memorial_id", memorialId)
      .eq("status", "pending")
      .gte("created_at", since)
    if (error) return false // unmigrated database: no pending queue to cap
    total += count ?? 0
  }
  return total >= PENDING_CAP_PER_DAY
}

export function moderationStatusFor(uploader: Uploader): ModerationStatus {
  return uploader.canPublish ? "approved" : "pending"
}

/** Only accept blob URLs from this project's public Vercel Blob store, under the memorial's folder. */
export function isMemorialBlobUrl(url: string, memorialId: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:") return false
    if (!parsed.hostname.endsWith(".public.blob.vercel-storage.com")) return false
    const storeId = blobStoreId()
    if (storeId && !parsed.hostname.toLowerCase().startsWith(`${storeId.toLowerCase()}.`)) return false
    return parsed.pathname.startsWith(`/memorials/${memorialId}/`)
  } catch {
    return false
  }
}

/** The store id is the third segment of the read-write token (vercel_blob_rw_<storeId>_<secret>). */
function blobStoreId(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? ""
  const match = token.match(/^vercel_blob_rw_([a-z0-9]+)_/i)
  return match ? match[1] : null
}
