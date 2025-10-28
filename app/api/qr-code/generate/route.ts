import { type NextRequest, NextResponse } from "next/server"
import { generateQRCodeBuffer } from "@/lib/qr-code"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { memorialId, memorialUrl } = await request.json()

    if (!memorialId || !memorialUrl) {
      return NextResponse.json({ error: "Memorial ID and URL are required" }, { status: 400 })
    }

    // Generate QR code as buffer
    const qrCodeBuffer = await generateQRCodeBuffer(memorialUrl)

    // Upload to Blob storage
    const blob = await put(`qr-codes/${memorialId}.png`, qrCodeBuffer, {
      access: "public",
      contentType: "image/png",
    })

    return NextResponse.json({
      success: true,
      qrCodeUrl: blob.url,
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
