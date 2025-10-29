import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { referralCode } = body

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already used a referral code
    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("*")
      .eq("referred_user_id", user.id)
      .single()

    if (existingReferral) {
      return NextResponse.json({ error: "You have already used a referral code" }, { status: 400 })
    }

    // Find the referral code
    const { data: codeData, error: codeError } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", referralCode.toUpperCase())
      .eq("is_active", true)
      .single()

    if (codeError || !codeData) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    // Can't refer yourself
    if (codeData.user_id === user.id) {
      return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 })
    }

    // Create referral record
    const { data: referral, error: referralError } = await supabase
      .from("referrals")
      .insert({
        referrer_user_id: codeData.user_id,
        referred_user_id: user.id,
        referral_code_id: codeData.id,
        status: "completed",
        reward_type: "free_month",
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (referralError) {
      console.error("[v0] Error creating referral:", referralError)
      return NextResponse.json({ error: "Failed to apply referral code" }, { status: 500 })
    }

    // Create rewards for both users
    const rewards = [
      {
        user_id: codeData.user_id,
        referral_id: referral.id,
        reward_type: "free_month",
        reward_value: 9.99,
        description: "1 month free for referring a friend",
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        user_id: user.id,
        referral_id: referral.id,
        reward_type: "discount_20",
        reward_value: 20,
        description: "20% off your first purchase",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const { error: rewardsError } = await supabase.from("referral_rewards").insert(rewards)

    if (rewardsError) {
      console.error("[v0] Error creating rewards:", rewardsError)
    }

    return NextResponse.json({
      success: true,
      message: "Referral code applied successfully!",
      reward: rewards[1],
    })
  } catch (error) {
    console.error("[v0] Apply referral error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
