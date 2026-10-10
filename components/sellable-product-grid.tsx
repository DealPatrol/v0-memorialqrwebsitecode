import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getListedKeepsakes } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { formatUsd } from "@/lib/site"

function listingLine(description: string): string {
  const sentence = description.split(". ")[0]
  return sentence.endsWith(".") ? sentence : `${sentence}.`
}

export function SellableProductGrid() {
  const products = getListedKeepsakes()
  if (products.length === 0) return null

  return (
    <section className="px-4 pb-12 pt-2">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-3 text-center text-3xl font-bold">QR keepsakes</h2>
        <p className="mb-8 text-center text-muted-foreground">
          {products.some((product) => product.available)
            ? `Shipped to United States addresses. Each keepsake includes ${HOSTING_INCLUDED_YEARS} years of memorial page hosting.`
            : "Our QR plaques are coming soon. Join the list on a plaque page and we will email you once when it can be ordered."}
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
