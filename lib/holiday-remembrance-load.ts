import { cache } from "react"
import {
  buildHolidayRemembrance,
  type HolidayMessageRow,
  type HolidayPhotoRow,
  type HolidayRemembrance,
  type HolidayStoryRow,
} from "@/lib/holiday-remembrance"
import { selectPublicMedia } from "@/lib/media/server"
import { isUuid } from "@/lib/media/shared"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

async function optionalRows<T>(
  label: string,
  query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  try {
    const { data, error } = await query
    if (error) {
      console.error(`Holiday remembrance ${label} failed:`, error.message)
      return []
    }
    return data ?? []
  } catch (error) {
    console.error(`Holiday remembrance ${label} failed:`, error instanceof Error ? error.message : error)
    return []
  }
}

/**
 * Loads the same memorial, stories, messages, and approved photos the public
 * memorial page uses. Returns null when the memorial does not exist or the
 * database is not configured.
 */
export const loadHolidayRemembrance = cache(async (slugOrId: string): Promise<HolidayRemembrance | null> => {
  try {
    const db = createServiceRoleClient()
    const { data, error } = await db
      .from("memorials")
      .select("*")
      .eq(isUuid(slugOrId) ? "id" : "slug", slugOrId)
      .maybeSingle()
    if (error || !data) {
      if (error) console.error("Holiday remembrance lookup failed:", error.message)
      return null
    }
    const memorialId = typeof data.id === "string" ? data.id : ""
    if (!memorialId) return null

    const [photos, stories, messages] = await Promise.all([
      selectPublicMedia("photos", memorialId, { limit: 24 }).catch((photoError: unknown) => {
        console.error("Holiday remembrance photos failed:", photoError instanceof Error ? photoError.message : photoError)
        return [] as HolidayPhotoRow[]
      }),
      optionalRows<HolidayStoryRow>(
        "stories",
        db
          .from("stories")
          .select("id, title, content, author_name, created_at")
          .eq("memorial_id", memorialId)
          .order("created_at", { ascending: false })
          .limit(24),
      ),
      optionalRows<HolidayMessageRow>(
        "messages",
        db
          .from("messages")
          .select("id, content, author_name, created_at")
          .eq("memorial_id", memorialId)
          .order("created_at", { ascending: false })
          .limit(24),
      ),
    ])

    return buildHolidayRemembrance(data, stories, messages, photos)
  } catch (error) {
    console.error("Holiday remembrance load failed:", error instanceof Error ? error.message : error)
    return null
  }
})
