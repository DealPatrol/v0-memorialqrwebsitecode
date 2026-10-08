import Link from "next/link"
import { Header } from "@/components/header"
import { FuneralHomeInquiryForm } from "@/components/funeral-home-inquiry-form"
import { Card, CardContent } from "@/components/ui/card"
import { buyerIntentList, PRIMARY_KEEPSAKE_ID } from "@/lib/buyer-intent"
import { getSellableKeepsake } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"

export const metadata = pageMetadata(publicPages.funeralHomes)

export default function FuneralHomesPage() {
  const plaque = getSellableKeepsake(PRIMARY_KEEPSAKE_ID)
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <main className="mx-auto grid max-w-5xl items-start gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="space-y-5">
          <h1 className="text-4xl font-bold text-foreground">For funeral homes</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Families ask for a way to share photos after the service. A QR code on a program or a plaque can open one
            memorial page, without asking guests to create an account.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            MemorialsQR sells a QR memorial plaque
            {plaque ? ` for ${formatUsd(plaque.price)}` : ""}, with the memorial page and {HOSTING_INCLUDED_YEARS} years
            of hosting included.
            If you want to offer that to the families you serve, send a wholesale inquiry. We reply by email. This form
            does not place an order and does not charge a card.
          </p>
          <p className="text-muted-foreground">
            Families can also order the plaque themselves from the{" "}
            <Link href="/store/qr-memorial-plaque" className="underline">
              QR Memorial Plaque
            </Link>{" "}
            page, or read about a{" "}
            <Link href="/funeral-program-qr-code" className="underline">
              QR code for a funeral program
            </Link>
            .
          </p>
          <nav aria-label="Family guides" className="space-y-2">
            <h2 className="text-xl font-semibold">Pages families use</h2>
            <ul className="space-y-1">
              {buyerIntentList.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="underline">
                    {item.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Wholesale inquiry</h2>
            <FuneralHomeInquiryForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
