import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { giftIntentList } from "@/lib/gift-intent"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.gifts)

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/gifts", label: "Gifts" },
          ]}
        />
        <h1 className="mb-4 text-4xl font-bold text-foreground">Memorial gift ideas</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          These are gifts for a person who is grieving. Each one is the same QR Memorial Plaque, chosen for a different
          relationship. A pet gift is for the person who lost a pet. A pet memorial QR code is the pet&apos;s own page.
        </p>
        <ul className="space-y-3">
          {giftIntentList.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className="text-lg underline">
                {item.h1}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/pet-memorial-qr-code" className="text-lg underline">
              A pet memorial QR code, for the pet&apos;s own page
            </Link>
          </li>
          <li>
            <Link href="/store/qr-memorial-plaque" className="text-lg underline">
              Buy the QR Memorial Plaque
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}
