import { NextResponse } from "next/server"
import { listSellableProducts } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"

export const dynamic = "force-dynamic"

export async function GET() {
  const products = listSellableProducts().map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    ships: product.ships,
    hostingIncludedYears: HOSTING_INCLUDED_YEARS,
    description: product.description ?? null,
    features: product.features ?? [],
  }))
  return NextResponse.json({ products })
}
