import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, orderId } = await request.json()
    const serviceRole = createServiceRoleClient()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    let claimOrder: { id: string; memorial_id: string | null } | null = null
    if (orderId) {
      const { data: order } = await serviceRole
        .from("orders")
        .select("id, memorial_id")
        .eq("id", orderId)
        .ilike("customer_email", email)
        .maybeSingle()

      if (!order) {
        return NextResponse.json(
          { success: false, error: "This email does not match the order." },
          { status: 400 },
        )
      }
      claimOrder = order
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Handle cookie errors silently during RSC
            }
          },
        },
      }
    )

    // Create user account in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (authError) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "Failed to create user account" },
        { status: 400 }
      )
    }

    if (claimOrder) {
      const { error: orderError } = await serviceRole
        .from("orders")
        .update({ user_id: authData.user.id })
        .eq("id", claimOrder.id)
      if (orderError) {
        return NextResponse.json({ success: false, error: "Account created, but order claim failed." }, { status: 500 })
      }
      if (claimOrder.memorial_id) {
        const { data: claimedMemorial, error: memorialError } = await serviceRole
          .from("memorials")
          .update({ user_id: authData.user.id })
          .eq("id", claimOrder.memorial_id)
          .is("user_id", null)
          .select("id")
          .maybeSingle()
        if (memorialError || !claimedMemorial) {
          return NextResponse.json(
            { success: false, error: "Account created, but memorial claim failed." },
            { status: 500 },
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    })
  } catch (error: any) {
    console.error("[v0] Account creation error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Account creation failed" },
      { status: 500 }
    )
  }
}
