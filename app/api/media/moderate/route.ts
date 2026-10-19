import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { canModerate, resolveMemorial, updateMediaRow, type MediaTable } from "@/lib/media/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const runtime = "nodejs"

/**
 * Memorial owner (or site admin) approves or hides a visitor upload.
 * "reject" only hides the item (status = rejected); nothing is deleted.
 */
export async function POST(request: NextRequest) {
  let body: { table?: string; id?: string; action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const table = ["photos", "videos", "music"].includes(body.table ?? "") ? (body.table as MediaTable) : null
  const action = body.action === "approve" ? "approved" : body.action === "reject" ? "rejected" : null
  if (!table || !action || !body.id) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const db = createServiceRoleClient()
  const { data: row, error } = await db.from(table).select("id, memorial_id").eq("id", body.id).maybeSingle()
  if (error || !row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const memorial = await resolveMemorial(row.memorial_id, db)
  if (!memorial || !(await canModerate(memorial))) {
    return NextResponse.json({ error: "Only the memorial owner can approve uploads" }, { status: 403 })
  }

  try {
    const updated = await updateMediaRow(table, row.id, { status: action }, db)
    if (!updated) return NextResponse.json({ error: "Moderation is not enabled on this database yet" }, { status: 409 })
    revalidatePath(`/memorial/${memorial.slug}`)
    revalidatePath(`/memorial/${memorial.id}`)
    return NextResponse.json({ success: true, status: action })
  } catch (err) {
    console.error("[media/moderate]", err instanceof Error ? err.message : err)
    return NextResponse.json({ error: "Could not update" }, { status: 500 })
  }
}
