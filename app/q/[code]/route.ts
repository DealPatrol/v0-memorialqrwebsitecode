import { NextResponse } from "next/server"
import { isShortCode, SAMPLE_CODE, SAMPLE_DESTINATION, scanDestination } from "@/lib/partner-memorials"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }

/** A temporary (302) redirect, so the printed URL keeps working when the destination changes. */
function redirectTo(path: string, request: Request): NextResponse {
  const response = NextResponse.redirect(new URL(path, request.url), 302)
  for (const [key, value] of Object.entries(NO_STORE)) response.headers.set(key, value)
  return response
}

function notFound(): NextResponse {
  return new NextResponse("We couldn't find a memorial for this code.", { status: 404, headers: NO_STORE })
}

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const code = decodeURIComponent(params.code || "").trim()
  if (code.toLowerCase() === SAMPLE_CODE) return redirectTo(SAMPLE_DESTINATION, request)
  if (!isShortCode(code)) return notFound()

  try {
    const supabase = createServiceRoleClient()
    const link = await supabase
      .from("partner_memorial_codes")
      .select("memorial_id, claimed_at")
      .eq("code", code)
      .maybeSingle()
    if (link.error) throw new Error(link.error.message)

    const memorial = link.data?.memorial_id
      ? await supabase.from("memorials").select("id, slug").eq("id", link.data.memorial_id).maybeSingle()
      : await supabase.from("memorials").select("id, slug").eq("slug", code).maybeSingle()
    if (memorial.error) throw new Error(memorial.error.message)

    const destination = scanDestination(code, link.data ?? null, memorial.data ?? null)
    return destination ? redirectTo(destination, request) : notFound()
  } catch (error) {
    console.error("[q] lookup failed:", error instanceof Error ? error.message : error)
    return new NextResponse("The memorial page is temporarily unavailable. Please try again in a minute.", {
      status: 503,
      headers: { ...NO_STORE, "Retry-After": "60" },
    })
  }
}
