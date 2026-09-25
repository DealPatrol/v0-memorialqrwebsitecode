import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Cookie Policy | Memorial QR",
  description: "How Memorial QR uses cookies and similar browser storage.",
  alternates: {
    canonical: "/cookies",
  },
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-slate-900">Cookie Policy</h1>
        <div className="space-y-6 leading-relaxed text-slate-700">
          <p>
            Memorial QR uses cookies and similar browser storage to keep the site working, maintain sessions, remember
            your cart and preferences, and understand basic site usage.
          </p>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">Essential storage</h2>
            <p>
              Essential cookies and local storage support sign-in, checkout, security, and saved selections. Disabling
              them can prevent parts of the site from working.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">Analytics</h2>
            <p>
              We may use analytics to understand page visits and improve the service. Your browser settings can block
              or remove cookies.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">Questions</h2>
            <p>
              For more information, read our{" "}
              <Link href="/privacy" className="text-purple-700 underline">
                Privacy Policy
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-purple-700 underline">
                contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
