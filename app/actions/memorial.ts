"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMemorialFromOrder(
  orderId: string,
  memorialData: {
    fullName: string
    birthDate: string
    deathDate: string
    location: string
    biography: string
    profileImageUrl?: string
  },
) {
  try {
    const supabase = await createClient()

    // Generate slug from full name
    const slug = memorialData.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const { data: existing } = await supabase.from("memorials").select("id").eq("slug", slug).single()

    // If slug exists, append a number
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    // Create memorial
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .insert({
        full_name: memorialData.fullName,
        birth_date: memorialData.birthDate,
        death_date: memorialData.deathDate,
        location: memorialData.location,
        biography: memorialData.biography,
        profile_image_url: memorialData.profileImageUrl || "/placeholder.svg?height=400&width=400",
        slug: finalSlug,
      })
      .select()
      .single()

    if (memorialError) {
      console.error("[v0] Error creating memorial:", memorialError)
      return { success: false, error: memorialError.message }
    }

    // Link memorial to order
    const { error: linkError } = await supabase.from("orders").update({ memorial_id: memorial.id }).eq("id", orderId)

    if (linkError) {
      console.error("[v0] Error linking memorial to order:", linkError)
      // Memorial was created but linking failed - not critical
    }

    console.log("[v0] Memorial created and linked to order:", memorial.id)
    return { success: true, memorial }
  } catch (error: any) {
    console.error("[v0] Exception creating memorial:", error)
    return { success: false, error: error.message }
  }
}

export async function getMemorialBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("memorials").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching memorial:", error)
    return null
  }

  return data
}

export async function getMemorialStories(memorialId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stories:", error)
    return []
  }

  return data
}

export async function addStory(memorialId: string, authorName: string, title: string, content: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("stories")
    .insert({
      memorial_id: memorialId,
      author_name: authorName,
      title,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding story:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/memorial/${memorialId}`)
  return { success: true, data }
}

export async function getMemorialMessages(memorialId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return data
}

export async function addMessage(memorialId: string, authorName: string, content: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("messages")
    .insert({
      memorial_id: memorialId,
      author_name: authorName,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding message:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/memorial/${memorialId}`)
  return { success: true, data }
}

export async function getMemorialPhotos(memorialId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching photos:", error)
    return []
  }

  return data
}

export async function addPhoto(memorialId: string, imageUrl: string, caption: string, uploadedBy: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("photos")
    .insert({
      memorial_id: memorialId,
      image_url: imageUrl,
      caption,
      uploaded_by: uploadedBy,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding photo:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/memorial/${memorialId}`)
  return { success: true, data }
}

export async function getMemorialMusic(memorialId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("music")
    .select("*")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching music:", error)
    return []
  }

  return data
}
