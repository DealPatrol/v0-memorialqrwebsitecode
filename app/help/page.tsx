import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Search, Phone, Mail, MessageCircle, Book, Video, FileText, Users, HelpCircle } from "lucide-react"

const helpCategories = [
  {
    title: "Getting Started",
    icon: Book,
    articles: [
      "How to create your first memorial",
      "Understanding QR code plaques",
      "Setting up memorial privacy",
      "Adding photos and stories",
    ],
  },
  {
    title: "Account Management",
    icon: Users,
    articles: [
      "Managing your memorial account",
      "Updating memorial information",
      "Adding family administrators",
      "Changing notification settings",
    ],
  },
  {
    title: "Technical Support",
    icon: HelpCircle,
    articles: [
      "QR code not scanning properly",
      "Memorial page loading issues",
      "Photo upload problems",
      "Mobile device compatibility",
    ],
  },
  {
    title: "Billing & Orders",
    icon: FileText,
    articles: [
      "Understanding your invoice",
      "Tracking your QR plaque order",
      "Requesting refunds",
      "Updating billing information",
    ],
  },
]

const quickLinks = [
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: Video,
    href: "#",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageCircle,
    href: "/contact",
  },
  {
    title: "Phone Support",
    description: "Call 1-800-MEMORIAL",
    icon: Phone,
    href: "tel:1-800-MEMORIAL",
  },
  {
    title: "Email Support",
    description: "Send us your questions",
    icon: Mail,
    href: "mailto:support@memorialqr.com",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-lg">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How Can We Help You?</h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find answers to your questions, learn how to use our platform, or get in touch with our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 pr-4 py-4 text-lg border-2 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Quick Support Options</h2>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 text-center">
                  <link.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{link.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{link.description}</p>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href={link.href}>Get Help</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Browse Help Topics</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className="w-6 h-6 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href="#"
                          className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          {article}
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
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Popular Help Articles</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  How long does it take to receive my QR code plaque?
                </h3>
                <p className="text-muted-foreground">
                  QR code plaques are professionally engraved and ship within 3-5 business days via USPS Priority Mail.
                  You'll receive tracking information once your order ships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Can I update the memorial after it's created?
                </h3>
                <p className="text-muted-foreground">
                  Yes! You can log into your account anytime to add photos, update information, moderate messages, and
                  make changes to your memorial. There are no limits on updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">What if the QR code gets damaged?</h3>
                <p className="text-muted-foreground">
                  Our QR codes are weatherproof and designed to last for decades. If your plaque is damaged within 5
                  years, we'll replace it free of charge under our durability guarantee.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  How do I make my memorial private or public?
                </h3>
                <p className="text-muted-foreground">
                  You can control privacy settings in your memorial dashboard. Choose to make it completely public,
                  password-protected, or restricted to specific people you invite.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our compassionate support team is available 24/7 to help you create the perfect memorial for your loved one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-xl font-bold"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg bg-transparent"
            >
              <Link href="tel:1-800-MEMORIAL">Call 1-800-MEMORIAL</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-muted-foreground text-sm">
                Honoring memories with digital memorials that last forever.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-foreground transition-colors">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
