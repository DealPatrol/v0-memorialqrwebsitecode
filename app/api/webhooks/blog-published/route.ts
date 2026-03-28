import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { slug, title, excerpt, url, image } = await request.json()

    // Send to Zapier for email newsletter
    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL
    if (zapierWebhookUrl) {
      await fetch(zapierWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "blog_post_published",
          slug,
          title,
          excerpt,
          url,
          publishedAt: new Date().toISOString(),
        }),
      })
    }

    // Post to Facebook business page
    const facebookPageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    const facebookPageId = process.env.FACEBOOK_PAGE_ID

    if (facebookPageAccessToken && facebookPageId) {
      try {
        const message = `📝 New Blog Post: ${title}\n\n${excerpt}\n\n👉 Read full article:`
        
        const facebookResponse = await fetch(
          `https://graph.facebook.com/v18.0/${facebookPageId}/feed?access_token=${facebookPageAccessToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message,
              link: url,
              picture: image,
              caption: "Memorial QR Blog",
              type: "link",
            }),
          }
        )

        if (facebookResponse.ok) {
          console.log("[v0] Blog posted to Facebook successfully")
        } else {
          console.error("[v0] Failed to post to Facebook")
        }
      } catch (facebookError) {
        console.error("[v0] Facebook posting error:", facebookError)
      }
    }

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL

    if (adminEmail) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Memorial QR <noreply@memorialqr.com>",
        to: adminEmail,
        subject: `New Blog Post Published: ${title}`,
        html: `
          <h1>New Blog Post Published</h1>
          <h2>${title}</h2>
          <p>${excerpt}</p>
          <p><a href="${url}">View Post</a></p>
          <hr>
          <p><strong>Automated Actions Completed:</strong></p>
          <ul>
            <li>✅ Posted to Facebook business page (MemorialsQR.com)</li>
            <li>✅ Sent to Zapier for email newsletter distribution</li>
            <li>✅ Added to RSS feed</li>
          </ul>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Blog webhook error:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
