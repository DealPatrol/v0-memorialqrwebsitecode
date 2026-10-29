import Link from "next/link"
import { Header } from "@/components/header"
import { PRIORITY_BUYER_LINKS } from "@/lib/buyer-path-links"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mt-4 text-muted-foreground">That page does not exist. These pages do:</p>
        <ul className="mt-6 space-y-2">
          {PRIORITY_BUYER_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="underline">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/" className="underline">
              Memorial QR codes
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}
