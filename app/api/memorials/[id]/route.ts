import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceRoleClient()
    const identifier = params.id
    const isId = isUUID(identifier)

    const { data: memorial, error } = await supabase
      .from("memorials")
      .select("*")
      .eq(isId ? "id" : "slug", identifier)
      .maybeSingle()

    if (error) {
      console.error("Error fetching memorial:", error.message)
      return NextResponse.json({ error: "Failed to fetch memorial" }, { status: 500 })
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const [{ data: externalLinks }, { data: familyMembers }] = await Promise.all([
      supabase.from("external_links").select("*").eq("memorial_id", memorial.id).order("created_at"),
      supabase.from("family_members").select("*").eq("memorial_id", memorial.id).order("created_at"),
    ])

    return NextResponse.json({
      memorial,
      externalLinks: externalLinks || [],
      familyMembers: familyMembers || [],
    })
  } catch (error) {
    console.error("Error in memorial API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
