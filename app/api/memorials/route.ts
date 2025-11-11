import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Creating memorial with data:", {
      firstName: body.firstName,
      lastName: body.lastName,
      hasProfileImage: !!body.profileImageUrl,
      profileImageUrl: body.profileImageUrl,
    })

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

    // Generate unique memorial slug
    const slug = `${body.firstName}-${body.lastName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const birthDate = body.dateOfBirth && body.dateOfBirth.trim() !== "" ? body.dateOfBirth : null
    const deathDate = body.dateOfDeath && body.dateOfDeath.trim() !== "" ? body.dateOfDeath : null

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
        profile_image_url: body.profileImageUrl || null, // Store the profile image URL
        theme: body.theme || "classic", // Store theme selection
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

    console.log("[v0] Memorial created successfully with profile image:", memorial.profile_image_url)

    const memorialUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/memorial/${memorial.id}`

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

    return NextResponse.json({ memorial }, { status: 201 })
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
