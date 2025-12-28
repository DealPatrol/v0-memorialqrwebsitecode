import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export const runtime = "edge"

// GET family members for a memorial
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Get all family members for this memorial
    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("memorial_id", params.id)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ familyMembers: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST a new family member
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Ensure the memorial_id matches the URL parameter
    const familyMemberData = {
      ...body,
      memorial_id: params.id,
    }

    const { data, error } = await supabase.from("family_members").insert(familyMemberData).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ familyMember: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
