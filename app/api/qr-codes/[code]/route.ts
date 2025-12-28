import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export const runtime = "edge"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Find the QR code
    const { data: qrCode, error: qrError } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("unique_code", params.code)
      .single()

    if (qrError) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 })
    }

    // Get the associated memorial
    const { data: memorial, error: memorialError } = await supabase
      .from("memorials")
      .select("*")
      .eq("id", qrCode.memorial_id)
      .single()

    if (memorialError) {
      return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    }

    // Track visit
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    await supabase.from("visitors").insert({
      memorial_id: memorial.id,
      ip_address: clientIp,
      user_agent: userAgent,
    })

    return NextResponse.json({ qrCode, memorial })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
