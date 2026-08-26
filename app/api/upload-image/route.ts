import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const blob = await put(`picture-plaques/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error: any) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
