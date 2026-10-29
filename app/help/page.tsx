import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Phone, Mail, Book, Video, FileText, Users, HelpCircle } from 'lucide-react'
import { CONCIERGE_PRICE_LABEL, pageMetadata, publicPages } from "@/lib/seo"
import { SUPPORT_EMAIL } from "@/lib/site"

export const metadata = pageMetadata(publicPages.help)

const helpCategories = [
  {
    title: "Getting Started",
    icon: Book,
    articles: [
      { label: "How to create your first memorial", href: "/how-it-works" },
      { label: "How a QR code memorial works", href: "/how-it-works" },
      { label: "Setting up memorial privacy", href: "/faq" },
      { label: "Adding photos and stories", href: "/faq" },
    ],
  },
  {
    title: "Account Management",
    icon: Users,
    articles: [
      { label: "Managing your memorial account", href: "/contact" },
      { label: "Updating memorial information", href: "/faq" },
      { label: "Adding family administrators", href: "/faq" },
      { label: "Changing notification settings", href: "/contact" },
    ],
  },
  {
    title: "Technical Support",
    icon: HelpCircle,
    articles: [
      { label: "QR code not scanning properly", href: "/faq" },
      { label: "Memorial page loading issues", href: "/contact" },
      { label: "Photo upload problems", href: "/faq" },
      { label: "Mobile device compatibility", href: "/faq" },
    ],
  },
  {
    title: "Billing & Orders",
    icon: FileText,
    articles: [
      { label: "Understanding your invoice", href: "/pricing" },
      { label: "Understanding your 10 years of included hosting", href: "/faq" },
      { label: "Requesting refunds", href: "/faq" },
      { label: "How much a QR memorial plaque costs", href: "/pricing#qr-memorial-plaque-cost" },
    ],
  },
]

const quickLinks = [
  {
    title: "How it works",
    description: "The steps to order a memorial page",
    icon: Video,
    href: "/how-it-works",
  },
  {
    title: "Phone Support",
    description: "Call 256-595-3354",
    icon: Phone,
    href: "tel:256-595-3354",
  },
  {
    title: "Email Support",
    description: "Send us your questions",
    icon: Mail,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-lg">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How Can We Help You?</h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions, learn how to use our platform, or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Support Options</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <link.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                  <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Link href={link.href}>Get Help</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse Help Topics</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className="w-6 h-6 text-orange-600" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article) => (
                      <li key={article.href + article.label}>
                        <Link
                          href={article.href}
                          className="text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-orange-600 rounded-full" />
                          {article.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Help Articles</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Is anything shipped?</h3>
                <p className="text-gray-600">
                  The digital memorial page is not shipped. You get the page and a QR code you can print or share.
                  Metal plaques are coming soon and are not for sale yet. The store lists printed keepsakes only when
                  checkout can accept them. The concierge memorial service is {CONCIERGE_PRICE_LABEL} if you want us to
                  build the page.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I update the memorial after it's created?
                </h3>
                <p className="text-gray-600">
                  Yes! You can log into your account anytime to add photos, update information, moderate messages, and
                  make changes to your memorial. There are no limits on updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What if I need a new QR code?</h3>
                <p className="text-gray-600">
                  Download another code from the QR generator. It opens the same memorial page. We do not sell or ship
                  replacement plaques.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How do I make my memorial private or public?
                </h3>
                <p className="text-gray-600">
                  You can control privacy settings in your memorial dashboard. Choose to make it completely public,
                  password-protected, or restricted to specific people you invite.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our compassionate support team is here to help you create the perfect memorial for your loved one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-xl font-bold"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent"
            >
              <Link href="tel:256-595-3354">Call 256-595-3354</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-gray-400 text-sm">Honoring memories with QR keepsakes and memorial pages, with 10 years of hosting included.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
