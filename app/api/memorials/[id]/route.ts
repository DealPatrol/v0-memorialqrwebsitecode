import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export const runtime = "edge"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("*")
      .eq("id", params.id)
      .single()

    if (memorialError) {
      return NextResponse.json({ error: memorialError.message }, { status: 404 })
    }

    // Get media for this memorial
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("memorial_id", params.id)
      .order("display_order", { ascending: true })

    // Get approved stories for this memorial
    const { data: stories, error: storiesError } = await supabase
      .from("stories")
      .select("*")
      .eq("memorial_id", params.id)
      .eq("is_approved", true)

    // Track visit
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    await supabase.from("visitors").insert({
      memorial_id: params.id,
      ip_address: clientIp,
      user_agent: userAgent,
    })

    return NextResponse.json({
      memorial,
      media: media || [],
      stories: stories || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase.from("memorials").update(body).eq("id", params.id).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ memorial: data[0] })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("memorials").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
