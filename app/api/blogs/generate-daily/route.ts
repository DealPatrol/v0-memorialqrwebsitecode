import { NextResponse } from "next/server"
import { generateText } from "ai"

// Topics to rotate through for daily blog posts
const blogTopics = [
  {
    title: "Creating a Pet Memorial: How to Honor Your Furry Friend",
    category: "Pet Memorials",
    keywords: ["pet memorial", "dog memorial", "cat memorial", "pet tribute"],
  },
  {
    title: "The Healing Power of Digital Memorials: Why QR Code Tributes Matter",
    category: "Guides",
    keywords: ["digital memorial", "QR code", "healing", "tribute"],
  },
  {
    title: "How to Grieve Healthily: 7 Practices for Emotional Wellness",
    category: "Grief Support",
    keywords: ["grief", "healing", "support", "emotional wellness"],
  },
  {
    title: "Memorial Gift Ideas: What to Give When Someone Is Grieving",
    category: "Gift Ideas",
    keywords: ["memorial gifts", "grieving", "support", "thoughtful gifts"],
  },
  {
    title: "Understanding the QR Code Memorial Technology",
    category: "Technology",
    keywords: ["QR codes", "memorial technology", "digital tributes"],
  },
  {
    title: "Family Heirlooms: Preserving Stories for Future Generations",
    category: "Family Legacy",
    keywords: ["family legacy", "memories", "heirlooms", "generations"],
  },
  {
    title: "The Importance of Cemetery Memorials in Our Culture",
    category: "Guides",
    keywords: ["cemetery", "memorials", "tradition", "culture"],
  },
  {
    title: "How to Create a Meaningful Memorial Service at Home",
    category: "Special Tributes",
    keywords: ["memorial service", "tribute", "ceremony", "family"],
  },
]

export async function GET(request: Request) {
  try {
    // Verify this is called from Vercel cron or authorized source
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Select today's topic
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const topicIndex = dayOfYear % blogTopics.length
    const todaysTopic = blogTopics[topicIndex]

    // Generate blog post content using AI
    const { text: content } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `Write a comprehensive, SEO-optimized blog post about: "${todaysTopic.title}"
      
      Category: ${todaysTopic.category}
      Keywords: ${todaysTopic.keywords.join(", ")}
      
      The post should be:
      - 800-1200 words
      - Written for someone grieving or creating memorials
      - Include practical tips and advice
      - Be empathetic and respectful
      - Include a call-to-action at the end mentioning Memorial QR codes
      
      Format as markdown with proper headings.`,
    })

    // Generate excerpt
    const excerptMatch = content.split("\n").slice(1, 3).join(" ")
    const excerpt = excerptMatch.substring(0, 160) + "..."

    // Create the blog post object
    const blogPost = {
      slug: `daily-${today.toISOString().split("T")[0]}-${todaysTopic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: todaysTopic.title,
      excerpt,
      category: todaysTopic.category,
      author: "Memorial QR",
      date: today.toISOString(),
      content,
      featured: false,
      readTime: "5 min read",
    }

    // Trigger blog published webhook to post to Facebook & send email
    const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/blog/${blogPost.slug}`
    
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/api/webhooks/blog-published`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: blogPost.slug,
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        url: blogUrl,
        image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"}/images/blog-default.jpg`,
      }),
    })

    console.log(`[v0] Daily blog generated: ${blogPost.title}`)

    return NextResponse.json({
      success: true,
      blog: blogPost,
      message: `Daily blog post generated and posted to Facebook: ${blogPost.title}`,
    })
  } catch (error) {
    console.error("[v0] Daily blog generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate daily blog" },
      { status: 500 }
    )
  }
}
