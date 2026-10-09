import Link from "next/link"
import { Header } from "@/components/header"
import { CreditCard, Heart, Lock, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { pageMetadata, publicPages } from "@/lib/seo"
import { SUPPORT_EMAIL } from "@/lib/site"

export const metadata = pageMetadata(publicPages.security)

const safeguards = [
  {
    icon: Lock,
    title: "Encrypted connections",
    description: "Every page and upload travels over HTTPS, so memories and account details are encrypted on the way to us.",
  },
  {
    icon: CreditCard,
    title: "Payments handled by Square",
    description:
      "Card details are entered into Square's secure payment form. Square processes the payment, and MemorialsQR never sees or stores your full card number.",
  },
  {
    icon: EyeOff,
    title: "Private memorials stay private",
    description:
      "Memorials marked private are kept out of search results and our public sitemap. Only people you share the link with can find them.",
  },
  {
    icon: Heart,
    title: "A person to help, not a ticket queue",
    description: "Questions about privacy, a memorial, or an order go to our support inbox, and a member of our small team replies.",
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Security and privacy</p>
        <h1 className="mt-3 text-4xl font-bold text-black">Caring for the memories you trust us with</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          A memorial holds some of a family&apos;s most precious words and photos. Here is, plainly, how we protect them and what
          stays in your control.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {safeguards.map((item) => (
            <Card key={item.title} className="border-zinc-200">
              <CardContent className="p-6">
                <item.icon className="mb-4 h-7 w-7 text-black" aria-hidden="true" />
                <h2 className="mb-2 font-semibold text-black">{item.title}</h2>
                <p className="text-sm leading-6 text-zinc-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-16 rounded-2xl bg-zinc-50 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-black">Your memorial, your choices</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-black">We never sell your information</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                We do not sell, trade, or rent personal information. Read the full{" "}
                <Link className="font-semibold underline" href="/privacy-policy">privacy policy</Link>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Ask for a copy or deletion</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Update details from your dashboard, or email{" "}
                <a className="font-semibold underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to request a copy of your
                memorial or deletion of your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Ten years of hosting included</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Every keepsake includes 10 years of hosting for its memorial page, starting on the order date, with no recurring fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">30-day money-back guarantee</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                If you are not satisfied, contact us within 30 days of purchase for a refund, as described in our{" "}
                <Link className="font-semibold underline" href="/terms-of-service">terms of service</Link>.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-12 text-sm leading-6 text-zinc-600">
          Questions about security or privacy? We&apos;re glad to help at{" "}
          <a className="font-semibold underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </div>
    </div>
  )
}
