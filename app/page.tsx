import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { HomepageStickyCTA } from "@/components/homepage-sticky-cta"
import { CustomerTestimonials } from "@/components/customer-testimonials"
import { ProductSelector } from "@/components/product-selector"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import { QuickLinksBar } from "@/components/quick-links-bar"
import { FeaturedMemorialPreview } from "@/components/featured-memorial-preview"
import { TrustBadges } from "@/components/trust-badges"
import { FAQPreview } from "@/components/faq-preview"
import { RelatedContentLinks } from "@/components/related-content-links"
import { EmailCollectionPopup } from "@/components/email-collection-popup"
import { ExpertEndorsements } from "@/components/expert-endorsements"
import { CaseStudies } from "@/components/case-studies"
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
  Star,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <ScrollProgressBar />
      <Header />

      {/* Hero Section with Product Selector */}
      <section className="memorial-bg py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-secondary/50 border border-border">
              <span className="text-sm font-medium text-foreground">Honor and Remember</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Digital Memorials That Last Forever
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              Weather-resistant QR plaques transform cemetery headstones into interactive digital tributes. Share photos, videos, and memories—one scan away.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-border backdrop-blur-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-border backdrop-blur-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Lifetime Access</span>
              </div>
            </div>
          </div>

          <ProductSelector />
        </div>
      </section>

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
                Memorial QR codes are revolutionizing how we honor and remember loved ones. Our weather-resistant
                plaques attach securely to headstones, grave markers, and pet memorials, providing instant access to
                rich digital tributes that traditional engraved memorials cannot offer.
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

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Durable, Weather-Resistant Technology</h3>
              <p className="text-base leading-relaxed text-foreground">
                Our memorial QR plaques are engineered for permanence. Made from UV-resistant materials with sealed QR
                codes, they withstand harsh weather conditions including snow, rain, extreme heat, and freezing
                temperatures. Whether mounted on granite headstones in outdoor cemeteries or displayed indoors at
                memorial gardens, our plaques maintain perfect scan-ability for decades.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Easy Setup, Lifetime Access</h3>
              <p className="text-base leading-relaxed text-foreground">
                Creating a memorial QR code is simple. Choose your plaque style (Gold, Silver, or Black finish), create
                your digital memorial page by uploading photos and stories, and receive your custom QR plaque ready to
                install. Family members can scan the QR code with any smartphone camera—no special apps required—to
                instantly view the memorial page and contribute their own memories.
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
                  Memorial QR codes work beautifully for traditional cemetery headstones, cremation urns, memorial
                  benches, pet grave markers, military veteran memorials, roadside memorials, and memorial gardens.
                  They're also ideal for memorial jewelry, keychains, photo frames, and coasters that keep memories
                  close to your heart.
                </p>
              </div>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Affordable, Transparent Pricing</h3>
              <p className="text-base leading-relaxed text-foreground">
                Our memorial QR codes start at just $14.99 for keychains and coasters, $29.99 for premium plaques, and
                $49.99 for photo frames. All products include lifetime digital hosting for just $4.99 per month per
                memorial (not per product). Order multiple items for the same loved one and pay only one monthly hosting
                fee.
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
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Create Their Profile</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload photos, videos, and cherished memories to create a beautiful digital memorial page.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Get Your Memorial</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive a custom QR code plaque that links directly to their memorial page.
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
                <h3 className="text-lg font-semibold text-foreground mb-2">Lifetime Hosting</h3>
                <p className="text-muted-foreground text-sm">
                  Your memorial page will be hosted forever, ensuring lasting access for generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <CustomerTestimonials />

      <ExpertEndorsements />

      <CaseStudies />

      <FAQPreview />

      <RelatedContentLinks />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Create a Lasting Memorial?</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether honoring a loved one or a beloved pet, create a beautiful digital memorial that keeps their memory
            alive forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50 text-lg px-8">
              <Link href="/store">
                Shop Plaques
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

      {/* Sticky CTA */}
      <HomepageStickyCTA />

      {/* Email Collection Popup */}
      <EmailCollectionPopup />
    </div>
  )
}
