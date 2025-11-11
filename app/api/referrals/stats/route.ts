import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's referral code
    const { data: referralCode } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    // Get referral stats
    const { data: referrals, error: referralsError } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_user_id", user.id)

    const { data: rewards, error: rewardsError } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("user_id", user.id)

    const stats = {
      referralCode: referralCode?.code || null,
      totalReferrals: referrals?.length || 0,
      completedReferrals: referrals?.filter((r) => r.status === "completed").length || 0,
      pendingReferrals: referrals?.filter((r) => r.status === "pending").length || 0,
      totalRewards: rewards?.length || 0,
      claimedRewards: rewards?.filter((r) => r.claimed).length || 0,
      unclaimedRewards: rewards?.filter((r) => !r.claimed).length || 0,
      referrals: referrals || [],
      rewards: rewards || [],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Referral stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
