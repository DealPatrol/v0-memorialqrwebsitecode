import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import JSZip from "jszip"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memorialId = params.id
    const supabase = await createClient()

    const { data: memorial } = await supabase.from("memorials").select("full_name").eq("id", memorialId).single()

    const { data: photos } = await supabase
      .from("photos")
      .select("*")
      .eq("memorial_id", memorialId)
      .order("created_at", { ascending: false })

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "No photos found" }, { status: 404 })
    }

    const zip = new JSZip()
    const folder = zip.folder("photos") as JSZip

    const downloads = photos.map(async (photo, index) => {
      try {
        const response = await fetch(photo.image_url)
        if (!response.ok) return

        const buffer = await response.arrayBuffer()

        const contentType = response.headers.get("content-type") || ""
        const ext = contentType.includes("png")
          ? "png"
          : contentType.includes("gif")
            ? "gif"
            : contentType.includes("webp")
              ? "webp"
              : "jpg"

        const filename = `photo-${String(index + 1).padStart(3, "0")}.${ext}`
        folder.file(filename, buffer)
      } catch {
        // Skip photos that fail to download
      }
    })

    await Promise.all(downloads)

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" })

    const memorialName = memorial?.full_name ?? "memorial"
    const safeName = memorialName.replace(/[^a-z0-9]/gi, "-").toLowerCase()

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeName}-photos.zip"`,
        "Content-Length": String(zipBuffer.length),
      },
    })
  } catch (error) {
    console.error("[v0] Photo export error:", error)
    return NextResponse.json({ error: "Failed to export photos" }, { status: 500 })
  }
}
