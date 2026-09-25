import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url }, { status: 200 })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 })
  }
}
