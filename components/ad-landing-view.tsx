import Link from "next/link"
import { TrackViewContent } from "@/components/track-view-content"
import { Button } from "@/components/ui/button"
import type { AdLanding } from "@/lib/ad-landings"
import { PRIMARY_KEEPSAKE_ID } from "@/lib/buyer-intent"
import { getSellableKeepsake } from "@/lib/fulfillment-availability"

export function AdLandingView({ page }: { page: AdLanding }) {
  const product = page.trackProduct ? getSellableKeepsake(page.productId ?? PRIMARY_KEEPSAKE_ID) : null
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      {product ? (
        <TrackViewContent contentId={product.id} contentName={product.name} value={product.price} />
      ) : null}
      <p className="mb-6 text-sm text-muted-foreground">MemorialsQR</p>
      <h1 className="mb-6 text-4xl font-bold text-foreground">{page.h1}</h1>
      <div className="space-y-4">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
      <Button asChild className="mt-8 w-full">
        <Link href={page.ctaHref}>{page.ctaLabel}</Link>
      </Button>
    </main>
  )
}
