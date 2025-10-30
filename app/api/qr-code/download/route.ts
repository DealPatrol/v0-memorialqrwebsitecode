import { type NextRequest, NextResponse } from "next/server"
import { generateQRCodeBuffer } from "@/lib/qr-code"

export async function POST(request: NextRequest) {
  try {
    const { memorialUrl, fileName } = await request.json()

    if (!memorialUrl) {
      return NextResponse.json({ error: "Memorial URL is required" }, { status: 400 })
    }

    // Generate QR code as buffer
    const qrCodeBuffer = await generateQRCodeBuffer(memorialUrl)

    // Return as downloadable file
    return new NextResponse(qrCodeBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${fileName || "memorial-qr-code"}.png"`,
      },
    })
  } catch (error) {
    console.error("Error downloading QR code:", error)
    return NextResponse.json({ error: "Failed to download QR code" }, { status: 500 })
  }
}
