import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import { FeaturedMemorialPreview } from "@/components/featured-memorial-preview"
import { TrustBadges } from "@/components/trust-badges"
import { FAQPreview } from "@/components/faq-preview"
import { RelatedContentLinks } from "@/components/related-content-links"
import { MemorialGuideSection } from "@/components/memorial-guide-section"
import {
  Heart,
  QrCode,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Globe,
  Lock,
  PawPrint,
  User,
  CheckCircle,
} from "lucide-react"
import { buyerIntentList } from "@/lib/buyer-intent"
import { giftIntentList } from "@/lib/gift-intent"
import { getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.home)

export default function HomePage() {
  const physicalProducts = getSellableKeepsakes()
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <ScrollProgressBar />
      <Header />

      {/* Hero Section with Product Selector */}
      <section className="memorial-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-secondary/50 border border-border">
              <span className="text-sm font-medium text-foreground">Honor and Remember</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              QR Memorial Keepsakes With 10 Years of Hosting Included
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              Each keepsake carries a QR code that opens a memorial page for photos, videos, and stories. Every keepsake
              includes {HOSTING_INCLUDED_YEARS} years of hosting. One payment, no recurring fees.
              {physicalProducts.length === 0
                ? " Keepsakes are not available to order online right now."
                : " Keepsakes ship to United States addresses."}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-border backdrop-blur-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-border backdrop-blur-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{HOSTING_INCLUDED_YEARS} Years of Hosting Included</span>
              </div>
            </div>
          </div>

          <div id="digital-memorial" className="max-w-xl mx-auto">
            <Card className="bg-white border-border shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-3">QR Memorial Keepsakes</h2>
                <p className="text-muted-foreground mb-6">
                  Choose a keepsake, then set up the memorial page yourself or have our team build it. Hosting for{" "}
                  {HOSTING_INCLUDED_YEARS} years is included.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/store">
                      Shop Keepsakes
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/concierge">Have Us Build It</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12">
        <nav aria-label="Keepsake guides" className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">Ways families use a memorial QR</h2>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {buyerIntentList.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="underline">
                  {item.h1}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="mb-3 mt-8 text-2xl font-semibold text-foreground">Remembrance gifts</h2>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {giftIntentList.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="underline">
                  {item.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <SellableProductGrid />

      <TrustBadges />

      <FeaturedMemorialPreview />

      {/* SEO Content Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Why Choose Memorial QR Codes?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Preserve memories beyond what stone can hold
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <p className="text-base leading-relaxed text-foreground">
                A digital memorial holds the photos, videos, and stories that a name and two dates cannot. Family and
                friends open one page and can add their own memories over time.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">The Future of Cemetery Memorials</h3>
              <p className="text-base leading-relaxed text-foreground">
                Traditional headstones are limited by physical space—typically just a name, dates, and a brief
                inscription. Memorial QR codes break these boundaries by linking to comprehensive digital memorial pages
                containing unlimited photos, videos, life stories, military service records, family trees, and cherished
                memories shared by friends and family.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-10">
                <Card className="bg-secondary/30 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      For Human Memorials
                    </h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Preserve military service and veteran honors</li>
                      <li>• Share family history and genealogy</li>
                      <li>• Display photo galleries spanning decades</li>
                      <li>• Record voice messages and video tributes</li>
                      <li>• Enable virtual cemetery visits for distant family</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/30 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      For Pet Memorials
                    </h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li>• Celebrate your pet's unique personality</li>
                      <li>• Share favorite photos and videos</li>
                      <li>• Remember special moments and milestones</li>
                      <li>• Create lasting tributes for beloved companions</li>
                      <li>• Honor dogs, cats, horses, and all pets</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Easy Setup, Ongoing Access</h3>
              <p className="text-base leading-relaxed text-foreground">
                Create the memorial page by uploading photos and stories. Family members open the link on any phone and
                can add their own memories. Every keepsake includes {HOSTING_INCLUDED_YEARS} years of hosting for the page.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Privacy Controls & Family Collaboration</h3>
              <p className="text-base leading-relaxed text-foreground">
                You control who can view and contribute to your memorial page. Set it as public for anyone to visit, or
                make it private with password protection for family only. Invite multiple family members to collaborate
                by adding photos, videos, and stories, creating a living tribute that grows over time as memories are
                shared across generations.
              </p>

              <div className="bg-secondary/50 border border-border rounded-lg p-6 my-10">
                <h4 className="font-semibold text-lg mb-3 text-foreground">Perfect for All Memorial Types</h4>
                <p className="text-muted-foreground mb-4">
                  The page works for a person or a pet. Share the link with family, or keep it private. Each keepsake
                  includes {HOSTING_INCLUDED_YEARS} years of hosting for its memorial.
                </p>
              </div>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Affordable, Transparent Pricing</h3>
              <p className="text-base leading-relaxed text-foreground">
                You pay once for the keepsake. {HOSTING_INCLUDED_YEARS} years of memorial page hosting is included, with
                no subscription and no recurring charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Create a lasting tribute for your loved ones in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Choose a Keepsake</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pick a QR keepsake, then upload photos, videos, and memories to build the memorial page.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Hosting Included</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every keepsake includes {HOSTING_INCLUDED_YEARS} years of hosting for the memorial page.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Share Their Legacy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Friends and family can scan the QR code to view memories and share their own stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our memorials come with powerful features to honor those you love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Globe className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Unlimited Photos & Videos</h3>
                <p className="text-muted-foreground text-sm">Upload unlimited photos and videos to create a comprehensive memorial.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Lock className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Privacy Controls</h3>
                <p className="text-muted-foreground text-sm">Control who can view and contribute to your memorial page.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Family Collaboration</h3>
                <p className="text-muted-foreground text-sm">Invite family members to contribute photos, videos, and memories.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <User className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Human Memorials</h3>
                <p className="text-muted-foreground text-sm">
                  Honor veterans, parents, grandparents, and all those who touched our lives.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <PawPrint className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Pet Memorials</h3>
                <p className="text-muted-foreground text-sm">
                  Celebrate dogs, cats, horses, and all the furry friends who gave us unconditional love.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{HOSTING_INCLUDED_YEARS} Years of Hosting</h3>
                <p className="text-muted-foreground text-sm">
                  Every keepsake includes {HOSTING_INCLUDED_YEARS} years of memorial page hosting. No recurring fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FAQPreview />

      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <MemorialGuideSection />
        </div>
      </section>

      <RelatedContentLinks />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Create a Lasting Memorial?</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether honoring a loved one or a beloved pet, choose a QR keepsake with {HOSTING_INCLUDED_YEARS} years of memorial page hosting included.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50 text-lg px-8">
              <Link href="/store">
                Shop Keepsakes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/30 text-lg px-8"
            >
              <Link href="/concierge">
                Concierge Service
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 text-foreground py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="memorial-logo text-xl font-bold">Memorial QR</span>
              </div>
              <p className="text-muted-foreground text-sm">Creating lasting digital memorials to honor and remember your loved ones.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Services</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/human-memorials" className="hover:text-primary transition-colors">
                    Human Memorials
                  </Link>
                </li>
                <li>
                  <Link href="/pet-memorials" className="hover:text-primary transition-colors">
                    Pet Memorials
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="hover:text-primary transition-colors">
                    Store
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/our-story" className="hover:text-primary transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Memorial QR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
