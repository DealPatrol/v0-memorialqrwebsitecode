import { blogPosts } from "@/lib/blog-posts"

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://memorialqr.com"

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Memorial QR Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Helpful guides, memorial ideas, and grief support resources to honor your loved ones</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${blogPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <category>${post.category}</category>
      <author>${post.author}</author>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
