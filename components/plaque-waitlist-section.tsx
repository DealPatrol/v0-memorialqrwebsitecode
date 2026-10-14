import Link from "next/link"
import { PlaqueWaitlistForm } from "@/components/plaque-waitlist-form"
import { getListedKeepsakes } from "@/lib/fulfillment-availability"

/** Coming-soon plaques only. Sellable keepsakes stay off this form. */
export function PlaqueWaitlistSection() {
  const plaques = getListedKeepsakes().filter((product) => !product.available)
  if (plaques.length === 0) return null

  return (
    <section id="plaque-waitlist" className="scroll-mt-24 bg-secondary/20 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-foreground">Metal plaques are coming soon</h2>
        <p className="mb-8 text-center text-muted-foreground">
          We are not taking orders for these plaques yet. Leave your email and we will write once when one can be
          ordered. Nothing is charged.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {plaques.map((product) => (
            <div key={product.id} className="rounded-lg border border-border bg-white p-5">
              <h3 className="text-lg font-semibold text-foreground">
                <Link href={`/store/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">Coming soon. Not for sale.</p>
              <PlaqueWaitlistForm productId={product.id} anchor={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
