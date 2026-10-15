import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { PET_MEMORIAL_PLAQUE_ID, QR_MEMORIAL_PLAQUE_ID } from "@/lib/catalog"
import { getListedKeepsake } from "@/lib/fulfillment-availability"
import { giftIntentList } from "@/lib/gift-intent"
import { KEEPSAKE_COLLECTION_PATH } from "@/lib/keepsake-collection"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.gifts)

export const dynamic = "force-dynamic"

export default function GiftsPage() {
  const humanPlaque = getListedKeepsake(QR_MEMORIAL_PLAQUE_ID)
  const petPlaque = getListedKeepsake(PET_MEMORIAL_PLAQUE_ID)
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
          These pages are for a person who is grieving. Keepsakes you can order today are the ones checkout accepts.
          Metal plaques are separate: join the waitlist while they are not for sale. A pet memorial QR code is the
          pet&apos;s own page, not a gift for the person who lost them. When a keepsake can be ordered, checkout can
          mark it as a gift and ship it to the recipient.
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
            <Link href={KEEPSAKE_COLLECTION_PATH} className="text-lg underline">
              Keepsakes you can order
            </Link>
          </li>
          <li>
            <Link
              href={humanPlaque?.available ? `/store/${QR_MEMORIAL_PLAQUE_ID}` : `/store/${QR_MEMORIAL_PLAQUE_ID}#waitlist`}
              className="text-lg underline"
            >
              {humanPlaque?.available ? "QR Memorial Plaque" : "QR Memorial Plaque waitlist"}
            </Link>
          </li>
          <li>
            <Link
              href={petPlaque?.available ? `/store/${PET_MEMORIAL_PLAQUE_ID}` : `/store/${PET_MEMORIAL_PLAQUE_ID}#waitlist`}
              className="text-lg underline"
            >
              {petPlaque?.available ? "Pet Memorial QR Plaque" : "Pet Memorial QR Plaque waitlist"}
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}
