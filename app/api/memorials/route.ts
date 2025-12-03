import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient, generateSecurePassword } from "@/lib/supabase/admin"
import { sendAccountCreatedEmail } from "@/lib/email"

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
    let userId = body.userId || null

    if (!userId && body.customerEmail) {
      try {
        console.log("[v0] Creating auto-account for:", body.customerEmail)
        const adminClient = createAdminClient()
        const generatedPassword = generateSecurePassword(16)

        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email: body.customerEmail,
          password: generatedPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: body.customerName || `${body.firstName} ${body.lastName}`,
          },
        })

        if (authError) {
          console.error("[v0] Auto-account creation failed:", authError.message)
          // Continue without userId - memorial can still be created
        } else if (authData.user) {
          userId = authData.user.id
          console.log("[v0] Auto-account created successfully:", userId)
          // Store password to email later
          body._generatedPassword = generatedPassword
        }
      } catch (autoAccountError) {
        console.error("[v0] Exception during auto-account creation:", autoAccountError)
        // Continue without userId
      }
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
        user_id: userId, // Now includes auto-created user ID
        profile_image_url: body.profileImageUrl || null,
        theme: body.theme || "classic",
        package_type: packageType,
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

    const memorialUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"}/memorial/${memorial.id}`

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
        const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"}/dashboard`

        if (body._generatedPassword) {
          // Send email with account credentials
          await sendAccountCreatedEmail({
            customerName: body.customerName || `${body.firstName} ${body.lastName}`,
            customerEmail: body.customerEmail,
            generatedPassword: body._generatedPassword,
            memorialName: memorial.full_name,
            memorialUrl,
            dashboardUrl,
            qrCodeUrl: memorial.qr_code_url,
          })
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError)
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
