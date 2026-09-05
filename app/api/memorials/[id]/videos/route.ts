import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"

function getEmbed(url: string) {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/]+)/i)
  if (youtube?.[1]) return { provider: "youtube", id: youtube[1] }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo?.[1]) return { provider: "vimeo", id: vimeo[1] }
  return null
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServiceRoleClient()

    const identifier = id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq(isUUID ? "id" : "slug", identifier)
      .maybeSingle()

    if (memorialError) {
      console.error("Error finding memorial:", memorialError)
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const { data: videos, error } = await supabase
      .from("videos")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching videos:", error)
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    }

    return NextResponse.json({ videos: videos || [] })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { title, url } = await request.json()
  const embed = getEmbed(url || "")
  if (!title || !embed) {
    return NextResponse.json({ error: "Enter a title and a valid YouTube or Vimeo URL." }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const { data: memorial } = await supabase
    .from("memorials")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()
  if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })

  const { data: video, error } = await supabase
    .from("videos")
    .insert({
      memorial_id: id,
      video_url: url,
      title,
      uploaded_by: user.user_metadata?.full_name || user.email || "Memorial owner",
      user_id: user.id,
      embed_provider: embed.provider,
      embed_id: embed.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ video }, { status: 201 })
}
