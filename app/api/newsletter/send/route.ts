import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { slug, title, excerpt, imageUrl } = await request.json()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"
    const postUrl = `${siteUrl}/blog/${slug}`

    const supabase = await createClient()

    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("status", "active")

    if (error) throw error

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers found" })
    }

    const emailPromises = subscribers.map((subscriber) =>
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Memorial QR <noreply@memorialqr.com>",
        to: subscriber.email,
        subject: `New Article: ${title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; background: #f9f9f9; }
              .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              img { max-width: 100%; height: auto; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Memorial QR Blog</h1>
                <p>New Article Published</p>
              </div>
              <div class="content">
                ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="margin-bottom: 20px;" />` : ""}
                <h2>${title}</h2>
                <p>${excerpt}</p>
                <a href="${postUrl}" class="cta-button">Read Full Article</a>
              </div>
              <div class="footer">
                <p>You're receiving this because you subscribed to Memorial QR Blog newsletter.</p>
                <p><a href="${siteUrl}/unsubscribe?email=${subscriber.email}">Unsubscribe</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    )

    await Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
    })
  } catch (error) {
    console.error("Newsletter send error:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
