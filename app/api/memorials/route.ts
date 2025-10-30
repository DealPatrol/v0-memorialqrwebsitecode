import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Received memorial creation request:", {
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      dateOfDeath: body.dateOfDeath,
      location: body.location,
      hasBiography: !!body.biography,
      customerEmail: body.customerEmail,
      userId: body.userId,
    })

    if (!body.firstName || !body.lastName) {
      console.error("[v0] Validation failed: Missing required fields")
      return NextResponse.json(
        {
          error: "First name and last name are required",
          details: { firstName: body.firstName, lastName: body.lastName },
        },
        { status: 400 },
      )
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Generate unique memorial slug
    const slug = `${body.firstName}-${body.lastName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const birthDate = body.dateOfBirth && body.dateOfBirth.trim() !== "" ? body.dateOfBirth : null
    const deathDate = body.dateOfDeath && body.dateOfDeath.trim() !== "" ? body.dateOfDeath : null

    console.log("[v0] Preparing memorial data:", {
      full_name: `${body.firstName} ${body.lastName}`,
      birth_date: birthDate,
      death_date: deathDate,
      location: body.location || null,
      slug,
      hasBiography: !!body.biography,
      user_id: body.userId || null,
    })

    const { data: memorial, error } = await supabase
      .from("memorials")
      .insert({
        full_name: `${body.firstName} ${body.lastName}`,
        birth_date: birthDate,
        death_date: deathDate,
        location: body.location || null,
        biography: body.biography || null,
        slug,
        user_id: body.userId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error creating memorial:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
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
      console.error("[v0] Memorial creation returned no data")
      return NextResponse.json({ error: "Memorial was not created - no data returned" }, { status: 500 })
    }

    console.log("[v0] Memorial created successfully:", {
      id: memorial.id,
      slug: memorial.slug,
      full_name: memorial.full_name,
      user_id: memorial.user_id,
    })

    const memorialUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/memorial/${memorial.id}`

    try {
      console.log("[v0] Generating QR code for memorial:", memorial.id)

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

      if (!qrResponse.ok) {
        console.error("[v0] QR code generation failed with status:", qrResponse.status)
      } else {
        const qrData = await qrResponse.json()

        if (qrData.success && qrData.qrCodeUrl) {
          const { error: updateError } = await supabase
            .from("memorials")
            .update({ qr_code_url: qrData.qrCodeUrl })
            .eq("id", memorial.id)

          if (updateError) {
            console.error("[v0] Failed to update memorial with QR code:", updateError)
          } else {
            console.log("[v0] QR code generated and saved:", qrData.qrCodeUrl)
            memorial.qr_code_url = qrData.qrCodeUrl
          }
        }
      }
    } catch (qrError) {
      console.error("[v0] Exception generating QR code:", qrError)
    }

    if (body.customerEmail) {
      try {
        console.log("[v0] Sending welcome email to:", body.customerEmail)

        const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/dashboard`

        await sendWelcomeEmail({
          customerName: body.customerName || `${body.firstName} ${body.lastName}`,
          customerEmail: body.customerEmail,
          memorialName: memorial.full_name,
          memorialUrl,
          dashboardUrl,
          qrCodeUrl: memorial.qr_code_url,
        })

        console.log("[v0] Welcome email sent successfully")
      } catch (emailError) {
        console.error("[v0] Failed to send welcome email:", emailError)
      }
    }

    return NextResponse.json({ memorial }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Unexpected exception creating memorial:", {
      message: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      {
        error: "Failed to create memorial: " + error.message,
        type: error.name,
      },
      { status: 500 },
    )
  }
}
