import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Header } from "@/components/header"
import { buyerIntentList } from "@/lib/buyer-intent"
import { longTailList } from "@/lib/long-tail"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.guides)

const also = [
  { href: "/human-memorials", label: "A digital memorial for a loved one" },
  { href: "/pet-memorials", label: "A pet memorial page" },
  { href: "/memorial-qr-codes-tombstones", label: "QR code memorial pages" },
  { href: "/how-it-works", label: "How a memorial page works" },
  { href: "/faq", label: "Memorial page FAQ" },
  { href: "/store/qr-memorial-plaque", label: "The QR Memorial Plaque you can buy" },
  { href: "/store/pet-memorial-plaque", label: "The Pet Memorial QR Plaque you can buy" },
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
          Each guide is about one way families use a QR code. The keepsake for a person is the QR Memorial Plaque. The
          keepsake for a pet is the Pet Memorial QR Plaque. Each one opens one memorial page.
        </p>
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
      </main>
    </div>
  )
}
