import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaqueWaitlistForm } from "@/components/plaque-waitlist-form"
import type { SellableKeepsake } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import {
  formatUsd,
  KEEPSAKE_SHIPPING_COPY,
  SAMPLE_MEMORIAL_NAME,
  SAMPLE_MEMORIAL_PATH,
} from "@/lib/site"
import { PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID, type FulfillmentProvider } from "@/lib/catalog"

function shippingCopy(provider: FulfillmentProvider): string {
  switch (provider) {
    case "manual":
      return KEEPSAKE_SHIPPING_COPY
    case "printful":
    case "printify":
      return "Printed after payment and shipped to United States addresses. Shipping is included in the price."
    default: {
      const exhaustive: never = provider
      return exhaustive
    }
  }
}

function handmadePlaqueLine(id: string): string {
  switch (id) {
    case QR_MEMORIAL_PLAQUE_ID:
      return "A metal QR memorial plaque in the finish you write in the order notes: gold, silver, or black"
    case PET_MEMORIAL_PLAQUE_ID:
      return "A metal QR plaque for a pet, in the finish you write in the order notes: gold, silver, or black. This is not a collar tag"
    default:
      return "A metal QR memorial plaque in the finish you write in the order notes: gold, silver, or black"
  }
}

function familyReceives(product: SellableKeepsake): string[] {
  switch (product.provider) {
    case "manual":
      return [
        handmadePlaqueLine(product.id),
        "A unique QR code on that plaque",
        "A memorial page for photos, stories, and messages, created when you order",
        `${HOSTING_INCLUDED_YEARS} years of hosting from the order date, with no monthly fee`,
        "An email when the plaque ships",
      ]
    case "printful":
    case "printify":
      return [
        product.name,
        "A unique QR code for this memorial",
        "A memorial page for photos, stories, and messages",
        `${HOSTING_INCLUDED_YEARS} years of hosting from the order date, with no monthly fee`,
      ]
    default: {
      const exhaustive: never = product.provider
      return exhaustive
    }
  }
}

export function KeepsakePurchaseDetails({ product }: { product: SellableKeepsake }) {
  if (!product.available) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xl font-semibold text-foreground">Coming soon</p>
          <p className="text-sm text-muted-foreground">
            We are not taking orders for the {product.name} yet. Leave your email and we will write once when it can be
            ordered. Nothing is charged.
          </p>
        </div>
        <PlaqueWaitlistForm productId={product.id} />
        <p className="text-sm text-muted-foreground">
          You can still make a memorial page today, or{" "}
          <Link href="/concierge" className="underline">
            have us build it
          </Link>
          . See a sample page for{" "}
          <Link href={SAMPLE_MEMORIAL_PATH} className="underline">
            {SAMPLE_MEMORIAL_NAME}
          </Link>
          .
        </p>
      </div>
    )
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-3xl font-bold">{formatUsd(product.price)}</p>
        <p className="text-sm text-muted-foreground">One-time payment. Shipping included. No recurring fees.</p>
      </div>
      <Button asChild className="w-full" size="lg">
        <Link href={`/checkout/simple?product=${product.id}`}>Buy</Link>
      </Button>
      <div>
        <h2 className="text-sm font-semibold text-foreground">Shipping</h2>
        <p className="text-sm text-muted-foreground">{shippingCopy(product.provider)}</p>
        <p className="text-sm text-muted-foreground">
          Ordering for someone else? Mark the order as a gift at checkout, use their address if it is different from
          yours, and add a short message. The message is saved with the order. It is not engraved.
        </p>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-foreground">What the family receives</h2>
        <ul className="mt-2 space-y-2">
          {familyReceives(product).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-muted-foreground">
        See a sample memorial page for{" "}
        <Link href={SAMPLE_MEMORIAL_PATH} className="underline">
          {SAMPLE_MEMORIAL_NAME}
        </Link>
        .
      </p>
    </div>
  )
}
