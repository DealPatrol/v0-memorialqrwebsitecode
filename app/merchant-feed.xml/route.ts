import { buildMerchantFeedXml } from "@/lib/merchant-feed"

export function GET() {
  return new Response(buildMerchantFeedXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
