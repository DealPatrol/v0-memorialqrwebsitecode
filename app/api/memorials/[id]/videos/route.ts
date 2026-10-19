import { NextResponse } from "next/server"
import { resolveMemorial, selectPublicMedia } from "@/lib/media/server"

export const dynamic = "force-dynamic"

/** Approved videos for a memorial (visitor uploads waiting for the owner's approval are left out). */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const memorial = await resolveMemorial(params.id)
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    const videos = await selectPublicMedia("videos", memorial.id, { limit: 50 })
    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error fetching videos:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
