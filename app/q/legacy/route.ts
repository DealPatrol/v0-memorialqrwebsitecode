import { NextResponse } from "next/server"
import { SUPPORT_EMAIL } from "@/lib/site"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

const HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
}

function page(title: string, body: string, status = 200): NextResponse {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | MemorialsQR</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem;line-height:1.5;color:#292524"><main><h1>${title}</h1>${body}<p><a href="/">MemorialsQR</a></p></main></body></html>`,
    { status, headers: HEADERS },
  )
}

/**
 * Keepsakes printed before short links carry `/?ref=tailkept&order={id}`.
 * Middleware sends those here; once the order has a short code, the scan lands on it.
 */
export async function GET(request: Request) {
  const order = new URL(request.url).searchParams.get("order")?.trim() ?? ""
  if (!order || order.length > 80) return page("Memorial not found", "<p>This link is missing its order number.</p>", 400)

  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("partner_memorial_codes")
      .select("code, line_item_id")
      .eq("source", "tailkept")
      .eq("external_order_id", order)
      .order("line_item_id", { ascending: true })
    if (error) throw new Error(error.message)

    const rows = (data ?? []) as Array<{ code: string; line_item_id: string }>
    if (rows.length === 1) {
      const response = NextResponse.redirect(new URL(`/q/${rows[0].code}`, request.url), 302)
      response.headers.set("Cache-Control", "no-store")
      return response
    }
    if (rows.length > 1) {
      const links = rows
        .map((row, index) => `<li><a href="/q/${encodeURIComponent(row.code)}">Memorial ${index + 1}</a></li>`)
        .join("")
      return page("Memorials for this keepsake order", `<ul>${links}</ul>`)
    }
    return page(
      "This memorial page is being set up",
      `<p>The family that ordered this keepsake hasn't finished its memorial page yet. Please check back soon.</p><p>If you ordered it, email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> with order <strong>${escapeHtml(order)}</strong> and we'll send your setup link.</p>`,
    )
  } catch (error) {
    console.error("[q/legacy] lookup failed:", error instanceof Error ? error.message : error)
    return page("Temporarily unavailable", "<p>Please try again in a minute.</p>", 503)
  }
}
