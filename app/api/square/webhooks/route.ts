import { NextResponse } from "next/server"

/**
 * MemorialsQR no longer sells a recurring hosting plan, so there are no Square
 * subscription events to process. Keepsake orders are one-time payments that
 * are recorded by /api/checkout/process. This endpoint acknowledges any event
 * so Square does not retry, and takes no action.
 */
export async function POST(req: Request) {
  let type: unknown = null
  try {
    const body = await req.json()
    type = body?.type ?? null
  } catch {
    // Ignore malformed bodies.
  }
  console.log("[square-webhook] ignored event:", typeof type === "string" ? type : "unknown")
  return NextResponse.json({ success: true, ignored: true })
}
