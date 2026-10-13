import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const order = new URL(request.url).searchParams.get("order")?.trim()
  if (!order) return new NextResponse("Missing order.", { status: 400 })

  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("partner_memorial_codes")
      .select("code, memorial_id")
      .eq("source", "tailkept")
      .eq("external_order_id", order)

    if (error) {
      console.error("[q/legacy] lookup failed:", error.message)
      return new NextResponse("The memorial page is temporarily unavailable.", { status: 503 })
    }

    const rows = (data ?? []) as Array<{ code: string; memorial_id: string }>
    if (rows.length === 1) {
      return NextResponse.redirect(new URL(`/q/${rows[0].code}`, request.url))
    }
    if (rows.length === 0) {
      return new NextResponse("We couldn't find a memorial for this order yet.", { status: 404 })
    }

    const links = rows
      .map(
        (row) =>
          `<li><a href="/memorial/${row.memorial_id}">Memorial ${row.code}</a></li>`,
      )
      .join("")
    return new NextResponse(
      `<!doctype html><html><head><title>Memorials for this order</title></head><body><main><h1>Memorials for this order</h1><ul>${links}</ul></main></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
    )
  } catch (error) {
    console.error("[q/legacy] lookup failed:", error)
    return new NextResponse("The memorial page is temporarily unavailable.", { status: 503 })
  }
}
