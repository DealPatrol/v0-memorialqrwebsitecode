import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getListedKeepsakes, type SellableKeepsake } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

type GridMode = "all" | "available" | "coming-soon"

function listingLine(description: string): string {
  const sentence = description.split(". ")[0]
  return sentence.endsWith(".") ? sentence : `${sentence}.`
}

function productsForMode(mode: GridMode): SellableKeepsake[] {
  const listed = getListedKeepsakes()
  switch (mode) {
    case "all":
      return listed
    case "available":
      return listed.filter((product) => product.available)
    case "coming-soon":
      return listed.filter((product) => !product.available)
    default: {
      const exhaustive: never = mode
      return exhaustive
    }
  }
}

function gridIntro(mode: GridMode, anyAvailable: boolean): string {
  switch (mode) {
    case "all":
      return anyAvailable
        ? `Shipped to United States addresses. Each keepsake includes ${HOSTING_INCLUDED_YEARS} years of memorial page hosting.`
        : "Our QR plaques are coming soon. Join the list on a plaque page and we will email you once when it can be ordered."
    case "available":
      return `Checkout accepts these keepsakes right now. Shipping to United States addresses is included, with ${HOSTING_INCLUDED_YEARS} years of hosting. Metal plaques are not listed here.`
    case "coming-soon":
      return "These keepsakes are listed but not for sale. Join the list and we will email you once when one can be ordered."
    default: {
      const exhaustive: never = mode
      return exhaustive
    }
  }
}

export function SellableProductGrid({
  mode = "all",
  title,
  intro,
}: {
  mode?: GridMode
  title?: string
  intro?: string
}) {
  const products = productsForMode(mode)
  if (products.length === 0) return null
  const heading = title ?? (mode === "available" ? "Keepsakes you can order" : "QR keepsakes")

  return (
    <section className="px-4 pb-12 pt-2">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-3 text-center text-3xl font-bold">{heading}</h2>
        <p className="mb-8 text-center text-muted-foreground">
          {intro ?? gridIntro(mode, products.some((product) => product.available))}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={`/store/${product.id}`} className="hover:underline">
                    {product.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">{listingLine(product.description)}</p>
                {product.available ? (
                  <p className="text-2xl font-bold">{formatUsd(product.price)}</p>
                ) : (
                  <p className="text-lg font-semibold">Coming soon</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={product.available ? "default" : "outline"}>
                  {product.available ? (
                    <Link href={`/checkout/simple?product=${product.id}`}>Buy</Link>
                  ) : (
                    <Link href={`/store/${product.id}#waitlist`}>Join the list</Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
