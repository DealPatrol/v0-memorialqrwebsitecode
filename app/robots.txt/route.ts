import { MERCHANT_FEED_PATH } from "@/lib/merchant-feed"
import { SITE_URL } from "@/lib/site"

export function GET() {
  const body = `User-Agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/
Disallow: /admin/
Disallow: /test-square

# Google Merchant Center product feed: ${SITE_URL}${MERCHANT_FEED_PATH}

Sitemap: ${SITE_URL}/sitemap.xml
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
