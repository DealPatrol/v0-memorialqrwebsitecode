import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// For server-side usage (Edge Functions)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// For client-side usage
export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Singleton pattern for client-side Supabase client
let browserClient: ReturnType<typeof createBrowserSupabaseClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient()
  }
  return browserClient
}
