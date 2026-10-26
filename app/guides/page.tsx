import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { GraveQrNav } from "@/components/grave-qr-nav"
import { Header } from "@/components/header"
import { buyerIntentList } from "@/lib/buyer-intent"
import { giftIntentList } from "@/lib/gift-intent"
import { longTailList } from "@/lib/long-tail"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.guides)

const also = [
  { href: "/human-memorials", label: "A digital memorial for a loved one" },
  { href: "/pet-memorials", label: "A pet memorial page" },
  { href: "/memorial-qr-codes-tombstones", label: "QR code memorial pages" },
  { href: "/how-it-works", label: "How a memorial page works" },
  { href: "/faq", label: "Memorial page FAQ" },
  { href: "/store/qr-memorial-plaque#waitlist", label: "QR Memorial Plaque waitlist" },
  { href: "/store/pet-memorial-plaque#waitlist", label: "Pet Memorial QR Plaque waitlist" },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/guides", label: "Guides" },
          ]}
        />
        <h1 className="mb-4 text-4xl font-bold text-foreground">Memorial QR guides</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          Each guide is about one way families use a QR code. The metal QR plaques are coming soon and are not for
          sale. What you can order today is a digital memorial page and a QR code we email. Nothing is shipped.
        </p>
        <GraveQrNav
          className="mb-10"
          intro="These pages sell the digital memorial. You can print the QR code and place it later. Each page also has the plaque waitlist."
        />
        <ul className="space-y-3">
          {buyerIntentList.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className="text-lg underline">
                {item.h1}
              </Link>
            </li>
          ))}
          {longTailList.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className="text-lg underline">
                {item.h1}
              </Link>
            </li>
          ))}
          {also.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-lg underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mb-3 mt-10 text-2xl font-semibold text-foreground">Sympathy and remembrance gifts</h2>
        <p className="mb-4 text-muted-foreground">
          These pages are for someone buying a keepsake for a person who is grieving. At checkout you can mark the
          order as a gift, ship it to the recipient if they live somewhere else, and leave a short message.
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
            <Link href="/gifts" className="text-lg underline">
              All memorial gift ideas
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}
