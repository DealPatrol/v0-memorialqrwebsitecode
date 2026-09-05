import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Pair = {
  name?: string
  relationship?: string
  label?: string
  url?: string
}

function isSafeExternalUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
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
  const externalLinks = (body.externalLinks || []).filter(
    (item: Pair) => item.label && item.url && isSafeExternalUrl(item.url),
  )

  const [{ error: familyDeleteError }, { error: linksDeleteError }] = await Promise.all([
    supabase.from("family_members").delete().eq("memorial_id", id),
    supabase.from("external_links").delete().eq("memorial_id", id),
  ])

  if (familyDeleteError || linksDeleteError) {
    return NextResponse.json({ error: "Could not update family or links" }, { status: 500 })
  }

  const writes = []
  if (familyMembers.length > 0) {
    writes.push(
      supabase.from("family_members").insert(
        familyMembers.map((item: Pair) => ({
          memorial_id: id,
          name: item.name,
          relationship: item.relationship,
        })),
      ),
    )
  }
  if (externalLinks.length > 0) {
    writes.push(
      supabase.from("external_links").insert(
        externalLinks.map((item: Pair) => ({
          memorial_id: id,
          label: item.label,
          url: item.url,
        })),
      ),
    )
  }

  const results = await Promise.all(writes)
  const writeError = results.find((result) => result.error)?.error
  if (writeError) {
    return NextResponse.json({ error: writeError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
