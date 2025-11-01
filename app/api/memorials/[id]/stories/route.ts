import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const memorialSlug = id
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq("slug", memorialSlug)
      .maybeSingle()

    if (memorialError) {
      console.error("Error finding memorial:", memorialError)
      return NextResponse.json({ error: "Failed to find memorial" }, { status: 500 })
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const { data: stories, error } = await supabase
      .from("stories")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching stories:", error)
      return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
    }

    return NextResponse.json({ stories: stories || [] })
  } catch (error) {
    console.error("Error fetching stories:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { title, content, author_name } = await request.json()

    if (!title || !content || !author_name) {
      return NextResponse.json({ error: "Title, content, and author name required" }, { status: 400 })
    }

    const supabase = await createClient()

    const memorialSlug = id
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("id")
      .eq("slug", memorialSlug)
      .maybeSingle()

    if (memorialError || !memorial) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    const { data: story, error } = await supabase
      .from("stories")
      .insert({
        memorial_id: memorial.id,
        title,
        content,
        author_name,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating story:", error)
      return NextResponse.json({ error: "Failed to create story" }, { status: 500 })
    }

    return NextResponse.json({ story })
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 })
  }
}
