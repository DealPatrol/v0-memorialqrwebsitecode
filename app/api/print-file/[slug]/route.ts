import { NextResponse } from "next/server"
import { generateQRCodeBuffer } from "@/lib/qr-code"
import { memorialPageUrl } from "@/lib/memorial-urls"

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Unknown print file" }, { status: 404 })
  }

  const png = await generateQRCodeBuffer(memorialPageUrl(slug))
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
