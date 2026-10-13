import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const code = params.code.trim()
  if (!/^[a-z0-9-]{4,80}$/i.test(code)) {
    return new NextResponse("We couldn't find a memorial for this code.", { status: 404 })
  }

  try {
    const supabase = createServiceRoleClient()
    const link = await supabase
      .from("partner_memorial_codes")
      .select("memorial_id")
      .eq("code", code)
      .maybeSingle()
    if (link.data?.memorial_id) {
      return NextResponse.redirect(new URL(`/memorial/${link.data.memorial_id}`, request.url))
    }

    const memorial = await supabase.from("memorials").select("id").eq("slug", code).maybeSingle()
    if (memorial.data?.id) {
      return NextResponse.redirect(new URL(`/memorial/${memorial.data.id}`, request.url))
    }
  } catch (error) {
    console.error("[q] lookup failed:", error)
    return new NextResponse("The memorial page is temporarily unavailable.", { status: 503 })
  }

  return new NextResponse("We couldn't find a memorial for this code.", { status: 404 })
}
