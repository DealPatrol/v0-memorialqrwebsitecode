import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Pair = {
  name?: string
  relationship?: string
  label?: string
  url?: string
}

async function replaceRows(client: any, table: string, memorialId: string, rows: Record<string, unknown>[]) {
  const { data: existing, error: readError } = await client.from(table).select("id").eq("memorial_id", memorialId)
  if (readError) return readError

  let inserted: { id: string }[] = []
  if (rows.length > 0) {
    const result = await client.from(table).insert(rows).select("id")
    if (result.error) return result.error
    inserted = result.data || []
  }

  const existingIds = (existing || []).map((row: { id: string }) => row.id)
  if (existingIds.length > 0) {
    const { error: deleteError } = await client.from(table).delete().in("id", existingIds)
    if (deleteError) {
      const insertedIds = inserted.map((row) => row.id)
      if (insertedIds.length > 0) await client.from(table).delete().in("id", insertedIds)
      return deleteError
    }
  }

  return null
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const body = await request.json()
  const { data: memorial } = await supabase
    .from("memorials")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!memorial) {
    return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
  }

  const { error: memorialError } = await supabase
    .from("memorials")
    .update({
      full_name: body.fullName,
      birth_date: body.birthDate || null,
      death_date: body.deathDate || null,
      location: body.location || null,
      biography: body.biography || null,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (memorialError) {
    return NextResponse.json({ error: memorialError.message }, { status: 500 })
  }

  const familyMembers = (body.familyMembers || []).filter((item: Pair) => item.name && item.relationship)
  const externalLinks = (body.externalLinks || []).filter((item: Pair) => item.label && item.url)

  const replacementErrors = await Promise.all([
    replaceRows(
      supabase,
      "family_members",
      id,
      familyMembers.map((item: Pair) => ({
        memorial_id: id,
        name: item.name,
        relationship: item.relationship,
      })),
    ),
    replaceRows(
      supabase,
      "external_links",
      id,
      externalLinks.map((item: Pair) => ({
        memorial_id: id,
        label: item.label,
        url: item.url,
      })),
    ),
  ])
  const writeError = replacementErrors.find(Boolean)
  if (writeError) {
    return NextResponse.json({ error: writeError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
