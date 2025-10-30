import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

function generateReferralCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has an active code
    const { data: existingCode } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (existingCode) {
      return NextResponse.json({ code: existingCode })
    }

    // Generate unique code
    let code = generateReferralCode()
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase.from("referral_codes").select("id").eq("code", code).single()

      if (!existing) {
        isUnique = true
      } else {
        code = generateReferralCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Create referral code
    const { data: newCode, error } = await supabase
      .from("referral_codes")
      .insert({
        user_id: user.id,
        code,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating referral code:", error)
      return NextResponse.json({ error: "Failed to create referral code" }, { status: 500 })
    }

    return NextResponse.json({ code: newCode })
  } catch (error) {
    console.error("[v0] Referral code generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
