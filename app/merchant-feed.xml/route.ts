import { buildMerchantFeedXml } from "@/lib/merchant-feed"

export const dynamic = "force-dynamic"

export function GET() {
  return new Response(buildMerchantFeedXml(process.env), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
