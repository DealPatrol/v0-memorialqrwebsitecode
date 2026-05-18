import { type NextRequest, NextResponse } from "next/server"
import { PRODUCTS, getProductById } from "@/lib/products"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Get single product by ID
    if (id) {
      const product = getProductById(id)
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      return NextResponse.json({ product })
    }

    // Filter by category if provided
    let filtered = PRODUCTS
    if (category) {
      filtered = PRODUCTS.filter((p) => p.category === category)
    }

    // Handle pagination
    const pageOffset = offset ? Math.max(0, parseInt(offset)) : 0
    const pageLimit = limit ? Math.min(100, parseInt(limit)) : filtered.length

    const paginated = filtered.slice(pageOffset, pageOffset + pageLimit)

    return NextResponse.json({
      products: paginated,
      total: filtered.length,
      offset: pageOffset,
      limit: pageLimit,
      hasMore: pageOffset + pageLimit < filtered.length,
    })
  } catch (error) {
    console.error("[v0] Products API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 },
    )
  }
}
