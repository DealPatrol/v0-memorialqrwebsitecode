import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { nanoid } from "nanoid"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Generate a unique code for the QR
    const uniqueCode = nanoid(10)

    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        ...body,
        unique_code: uniqueCode,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ qrCode: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
