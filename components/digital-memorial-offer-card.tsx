import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH, DIGITAL_MEMORIAL_DESCRIPTION, DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { EXAMPLE_MEMORIAL_PATH } from "@/lib/example-memorial"
import { formatUsd } from "@/lib/site"

export function DigitalMemorialOfferCard() {
  const sentence = DIGITAL_MEMORIAL_DESCRIPTION.split(". ")[0]
  const line = sentence.endsWith(".") ? sentence : `${sentence}.`

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link href={DIGITAL_MEMORIAL_PATH} className="hover:underline">
            {DIGITAL_MEMORIAL_PRODUCT.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">{line}</p>
        <p className="text-2xl font-bold">{formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}</p>
        <p className="text-sm text-muted-foreground">Nothing is shipped.</p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button asChild className="w-full">
          <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>Buy</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={EXAMPLE_MEMORIAL_PATH}>See an example page</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
