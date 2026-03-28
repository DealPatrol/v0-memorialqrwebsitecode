import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const customerName = formData.get('customerName') as string
    const customerEmail = formData.get('customerEmail') as string
    const customerPhone = formData.get('customerPhone') as string
    const deceasedName = formData.get('deceasedName') as string
    const birthDate = formData.get('birthDate') as string
    const deathDate = formData.get('deathDate') as string
    const obituary = formData.get('obituary') as string
    const deliveryType = formData.get('deliveryType') as string
    const plaqueColor = formData.get('plaqueColor') as string

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Insert concierge request
    const { data: conciergeRequest, error: dbError } = await supabase
      .from('concierge_requests')
      .insert({
        user_id: user?.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        deceased_name: deceasedName,
        birth_date: birthDate || null,
        death_date: deathDate || null,
        obituary,
        delivery_type: deliveryType,
        plaque_color: plaqueColor,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save request' },
        { status: 500 }
      )
    }

    // Send notification email to support
    const adminEmail = process.env.ADMIN_EMAIL || 'support@memorials.com'
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Memorial QR <noreply@memorialqr.com>',
      to: adminEmail,
      subject: `New Concierge Request: ${deceasedName}`,
      html: `
        <h2>New Concierge Memorial Request</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
        
        <h3>Deceased Information</h3>
        <p><strong>Name:</strong> ${deceasedName}</p>
        <p><strong>Birth Date:</strong> ${birthDate || 'Not provided'}</p>
        <p><strong>Death Date:</strong> ${deathDate || 'Not provided'}</p>
        <p><strong>Obituary/Bio:</strong></p>
        <p>${obituary}</p>
        
        <h3>Delivery Options</h3>
        <p><strong>Type:</strong> ${deliveryType === 'plaque' ? `Plaque (${plaqueColor})` : 'Digital Link Only'}</p>
        
        <hr>
        <p><a href="https://memorialsqr.com/admin/concierge/${conciergeRequest.id}">View Request in Admin Dashboard</a></p>
      `,
    })

    // Send confirmation email to customer
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Memorial QR <noreply@memorialqr.com>',
      to: customerEmail,
      subject: `We've Received Your Memorial Request for ${deceasedName}`,
      html: `
        <h2>Thank You for Choosing Memorial QR Concierge</h2>
        <p>Hi ${customerName},</p>
        <p>We've received your memorial request for <strong>${deceasedName}</strong>. Our team will begin working on creating a beautiful, lasting tribute.</p>
        
        <h3>What Happens Next</h3>
        <ol>
          <li>Our team will review your materials within 24 hours</li>
          <li>We'll organize your photos, integrate videos, and write a polished biography</li>
          <li>You'll receive a preview of the memorial for approval</li>
          <li>We'll deliver your ${deliveryType === 'plaque' ? `${plaqueColor} plaque with QR code` : 'digital link'}</li>
        </ol>
        
        <p>If you have any questions, please reply to this email or contact us at support@memorials.com</p>
        <p>Honoring memories, preserving legacies,<br>The Memorial QR Team</p>
      `,
    })

    return NextResponse.json(
      { success: true, requestId: conciergeRequest.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Concierge submit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
