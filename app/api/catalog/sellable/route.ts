import { NextResponse } from "next/server"
import { listSellableProducts } from "@/lib/fulfillment-availability"

export const dynamic = "force-dynamic"

export async function GET() {
  const products = listSellableProducts().map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    monthlyFee: product.monthlyFee,
    ships: product.ships,
    description: product.description ?? null,
    features: product.features ?? [],
  }))
  return NextResponse.json({ products })
}
