import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        {
          error: "First name and last name are required",
          details: { firstName: body.firstName, lastName: body.lastName },
        },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let paidOrderId: string | null = null
    if (body.orderId) {
      if (!user) {
        return NextResponse.json({ error: "Sign in to set up the memorial for this order" }, { status: 401 })
      }

      const serviceRole = createServiceRoleClient()
      const { data: order, error: orderError } = await serviceRole
        .from("orders")
        .select("id, customer_email, user_id, payment_status, memorial_id")
        .eq("id", body.orderId)
        .maybeSingle()

      if (orderError || !order) {
        return NextResponse.json({ error: "A matching paid order is required" }, { status: 403 })
      }

      const ownsOrder = order.user_id === user.id || order.customer_email === user.email
      if (!ownsOrder || order.payment_status !== "completed") {
        return NextResponse.json({ error: "A matching paid order is required" }, { status: 403 })
      }

      if (order.memorial_id) {
        return NextResponse.json({ error: "This order is already linked to a memorial" }, { status: 409 })
      }

      paidOrderId = order.id
    }

    // Generate unique memorial slug
    const slug = `${body.firstName}-${body.lastName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const birthDate = body.dateOfBirth && body.dateOfBirth.trim() !== "" ? body.dateOfBirth : null
    const deathDate = body.dateOfDeath && body.dateOfDeath.trim() !== "" ? body.dateOfDeath : null

    const packageType = body.packageType || "basic"

    const { data: memorial, error } = await supabase
      .from("memorials")
      .insert({
        full_name: `${body.firstName} ${body.lastName}`,
        birth_date: birthDate,
        death_date: deathDate,
        location: body.location || null,
        biography: body.biography || null,
        slug,
        user_id: user?.id || null,
        profile_image_url: body.profileImageUrl || null, // Store the profile image URL
        theme: body.theme || "classic", // Store theme selection
        package_type: packageType, // Store package type
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error creating memorial:", error.message)
      return NextResponse.json(
        {
          error: "Database error: " + error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      )
    }

    if (!memorial) {
      return NextResponse.json({ error: "Memorial was not created - no data returned" }, { status: 500 })
    }

    const memorialUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/memorial/${memorial.slug}`

    try {
      const qrResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/qr-code/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memorialId: memorial.id,
            memorialUrl,
          }),
        },
      )

      if (qrResponse.ok) {
        const qrData = await qrResponse.json()

        if (qrData.success && qrData.qrCodeUrl) {
          const { error: updateError } = await supabase
            .from("memorials")
            .update({ qr_code_url: qrData.qrCodeUrl })
            .eq("id", memorial.id)

          if (!updateError) {
            memorial.qr_code_url = qrData.qrCodeUrl
          }
        }
      }
    } catch (qrError) {
      console.error("Exception generating QR code:", qrError)
    }

    if (paidOrderId) {
      const serviceRole = createServiceRoleClient()
      const { error: linkError } = await serviceRole
        .from("orders")
        .update({
          memorial_id: memorial.id,
          user_id: user?.id || null,
          status: memorial.qr_code_url ? "ready_for_fulfillment" : "setup_required",
        })
        .eq("id", paidOrderId)

      if (linkError) {
        console.error("Failed to link memorial to paid order:", linkError)
        return NextResponse.json(
          { error: "Memorial created, but the order could not be linked. Contact support with your order number." },
          { status: 500 },
        )
      }
    }

    if (body.customerEmail) {
      try {
        const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/dashboard`

        await sendWelcomeEmail({
          customerName: body.customerName || `${body.firstName} ${body.lastName}`,
          customerEmail: body.customerEmail,
          memorialName: memorial.full_name,
          memorialUrl,
          dashboardUrl,
          qrCodeUrl: memorial.qr_code_url,
        })
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError)
      }
    }

    return NextResponse.json(
      {
        memorial,
        memorialUrl,
        printFileUrl: memorial.qr_code_url || null,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Unexpected exception creating memorial:", error.message)
    return NextResponse.json(
      {
        error: "Failed to create memorial: " + error.message,
        type: error.name,
      },
      { status: 500 },
    )
  }
}
