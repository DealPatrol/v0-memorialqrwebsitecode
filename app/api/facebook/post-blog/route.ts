import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { slug, title, excerpt, url, image } = await request.json()

    const facebookPageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    const facebookPageId = process.env.FACEBOOK_PAGE_ID

    if (!facebookPageAccessToken || !facebookPageId) {
      console.error("[v0] Facebook credentials missing")
      return NextResponse.json(
        { error: "Facebook credentials not configured" },
        { status: 400 }
      )
    }

    // Create preview post with link
    const message = `📝 New Blog Post: ${title}\n\n${excerpt}\n\n👉 Read full article:`
    
    const postData = {
      message,
      link: url,
      picture: image,
      caption: "Memorial QR Blog",
      type: "link",
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${facebookPageId}/feed?access_token=${facebookPageAccessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Facebook API error:", data)
      return NextResponse.json(
        { error: data.error?.message || "Failed to post to Facebook" },
        { status: response.status }
      )
    }

    console.log("[v0] Blog posted to Facebook:", data.id)

    return NextResponse.json({ success: true, postId: data.id })
  } catch (error) {
    console.error("[v0] Facebook post error:", error)
    return NextResponse.json(
      { error: "Failed to post to Facebook" },
      { status: 500 }
    )
  }
}
