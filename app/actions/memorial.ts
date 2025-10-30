"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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

  revalidatePath(`/memorial/glenda-kelso`)
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

  revalidatePath(`/memorial/glenda-kelso`)
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

  revalidatePath(`/memorial/glenda-kelso`)
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
