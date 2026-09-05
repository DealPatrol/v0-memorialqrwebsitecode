import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { sendWelcomeEmail } from "@/lib/email"

function getVideoEmbed(url: string) {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/]+)/i)
  if (youtube?.[1]) return { provider: "youtube", id: youtube[1] }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo?.[1]) return { provider: "vimeo", id: vimeo[1] }

  return null
}

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
    const serviceRole = createServiceRoleClient()

    // Generate unique memorial slug
    const slug = `${body.firstName}-${body.lastName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const birthDate = body.dateOfBirth && body.dateOfBirth.trim() !== "" ? body.dateOfBirth : null
    const deathDate = body.dateOfDeath && body.dateOfDeath.trim() !== "" ? body.dateOfDeath : null

    const packageType = body.packageType || "basic"

    const memorialValues = {
        full_name: `${body.firstName} ${body.lastName}`,
        birth_date: birthDate,
        death_date: deathDate,
        location: body.location || null,
        biography: body.biography || null,
        slug,
        user_id: body.userId || null,
        profile_image_url: body.profileImageUrl || null, // Store the profile image URL
        theme: body.theme || "classic", // Store theme selection
        package_type: packageType, // Store package type
        product_type: body.productType || packageType,
      }

    let memorial
    let error

    if (body.orderId) {
      const { data: order } = await serviceRole
        .from("orders")
        .select("id, memorial_id, customer_email")
        .eq("id", body.orderId)
        .eq("customer_email", body.customerEmail)
        .maybeSingle()

      if (!order?.memorial_id) {
        return NextResponse.json({ error: "This order does not have a memorial reserved for setup." }, { status: 404 })
      }

      const { slug: _reservedSlug, ...updates } = memorialValues
      const result = await serviceRole
        .from("memorials")
        .update({
          ...updates,
          ...(body.userId ? { user_id: body.userId } : {}),
        })
        .eq("id", order.memorial_id)
        .select()
        .single()
      memorial = result.data
      error = result.error
    } else {
      const result = await supabase.from("memorials").insert(memorialValues).select().single()
      memorial = result.data
      error = result.error
    }

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

    const familyMembers = Array.isArray(body.familyMembers)
      ? body.familyMembers.filter((member: { name?: string; relationship?: string }) => member.name && member.relationship)
      : []
    const externalLinks = Array.isArray(body.externalLinks)
      ? body.externalLinks.filter((link: { label?: string; url?: string }) => link.label && link.url)
      : []
    const videoEmbeds = Array.isArray(body.videoEmbeds)
      ? body.videoEmbeds
          .map((video: { title?: string; url?: string }) => ({
            ...video,
            embed: video.url ? getVideoEmbed(video.url) : null,
          }))
          .filter((video: { title?: string; embed: unknown }) => video.title && video.embed)
      : []

    const contentWrites = []
    if (familyMembers.length > 0) {
      contentWrites.push(
        serviceRole.from("family_members").insert(
          familyMembers.map((member: { name: string; relationship: string }) => ({
            memorial_id: memorial.id,
            name: member.name,
            relationship: member.relationship,
          })),
        ),
      )
    }
    if (externalLinks.length > 0) {
      contentWrites.push(
        serviceRole.from("external_links").insert(
          externalLinks.map((link: { label: string; url: string }) => ({
            memorial_id: memorial.id,
            label: link.label,
            url: link.url,
          })),
        ),
      )
    }
    if (videoEmbeds.length > 0) {
      contentWrites.push(
        serviceRole.from("videos").insert(
          videoEmbeds.map((video: { title: string; url: string; embed: { provider: string; id: string } }) => ({
            memorial_id: memorial.id,
            title: video.title,
            video_url: video.url,
            uploaded_by: body.customerName || "Memorial creator",
            user_id: body.userId || null,
            embed_provider: video.embed.provider,
            embed_id: video.embed.id,
          })),
        ),
      )
    }
    const contentResults = await Promise.all(contentWrites)
    const contentError = contentResults.find((result) => result.error)?.error
    if (contentError) {
      console.error("Failed to save memorial details:", contentError)
      return NextResponse.json({ error: `Memorial created, but some details failed: ${contentError.message}` }, { status: 500 })
    }

    const memorialUrl = `https://www.memorialsqr.com/memorial/${memorial.slug}`

    try {
      const qrResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/qr-code/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memorialId: memorial.slug,
            memorialUrl,
          }),
        },
      )

      if (qrResponse.ok) {
        const qrData = await qrResponse.json()

        if (qrData.success && qrData.qrCodeUrl) {
          const { error: updateError } = await serviceRole
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
