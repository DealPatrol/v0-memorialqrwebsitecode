import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export const runtime = "edge"

// GET a specific family member
export async function GET(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("id", params.memberId)
      .eq("memorial_id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ familyMember: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// UPDATE a family member
export async function PUT(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("family_members")
      .update(body)
      .eq("id", params.memberId)
      .eq("memorial_id", params.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ familyMember: data[0] })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE a family member
export async function DELETE(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("id", params.memberId)
      .eq("memorial_id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
