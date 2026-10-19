import { NextResponse } from "next/server"
import { resolveMemorial, selectPublicMedia } from "@/lib/media/server"

export const dynamic = "force-dynamic"

/** Approved music for a memorial (visitor uploads waiting for the owner's approval are left out). */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const memorial = await resolveMemorial(params.id)
    if (!memorial) return NextResponse.json({ error: "Memorial not found" }, { status: 404 })
    const music = await selectPublicMedia("music", memorial.id, { limit: 200 })
    return NextResponse.json({ music })
  } catch (error) {
    console.error("Error fetching music:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 })
  }
}
