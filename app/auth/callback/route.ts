import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && authData.user) {
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }

      const { data: memorials } = await supabase.from("memorials").select("id").eq("user_id", authData.user.id).limit(1)

      if (memorials && memorials.length > 0) {
        return NextResponse.redirect(new URL("/products", requestUrl.origin))
      } else {
        return NextResponse.redirect(new URL("/", requestUrl.origin))
      }
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=Invalid authentication link", requestUrl.origin))
}
