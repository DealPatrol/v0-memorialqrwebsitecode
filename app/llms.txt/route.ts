import { buildLlmsTxt } from "@/lib/llms"

export const dynamic = "force-dynamic"

export function GET() {
  return new Response(buildLlmsTxt(process.env), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
