import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { PlaqueWaitlistSection } from "@/components/plaque-waitlist-section"
import { SellableProductGrid } from "@/components/sellable-product-grid"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import { FeaturedMemorialPreview } from "@/components/featured-memorial-preview"
import { TrustBadges } from "@/components/trust-badges"
import { FAQPreview } from "@/components/faq-preview"
import { RelatedContentLinks } from "@/components/related-content-links"
import { MemorialGuideSection } from "@/components/memorial-guide-section"
import { SisterShopNote } from "@/components/sister-shop-note"
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
import { DIGITAL_MEMORIAL_PRODUCT } from "@/lib/catalog"
import { DIGITAL_MEMORIAL_CHECKOUT_PATH, DIGITAL_MEMORIAL_PATH } from "@/lib/digital-memorial"
import { digitalLandingList, serviceLandingList } from "@/lib/digital-landing"
import { giftIntentList } from "@/lib/gift-intent"
import { getListedKeepsakes, getSellableKeepsakes } from "@/lib/fulfillment-availability"
import { KEEPSAKE_COLLECTION_PATH } from "@/lib/keepsake-collection"
import { HOSTING_INCLUDED_YEARS } from "@/lib/hosting"
import { pageMetadata, publicPages } from "@/lib/seo"
import { formatUsd } from "@/lib/site"
import { SympathyGiftNav } from "@/components/sympathy-gift-nav"

export const metadata = pageMetadata(publicPages.home)

export const dynamic = "force-dynamic"

export default function HomePage() {
  const physicalProducts = getSellableKeepsakes()
  const plaquesWaiting = getListedKeepsakes().some((product) => !product.available)
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Header />

      {/* Hero Section with Product Selector */}
      <section className="memorial-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-secondary/50 border border-border">
              <span className="text-sm font-medium text-foreground">Honor and Remember</span>
            </div>

            <h1 className="hero-lcp text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Keep their story close: QR memorial keepsakes with {HOSTING_INCLUDED_YEARS} years of hosting included
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              A gentle scan opens a memorial page where family and friends can see photos, watch videos, and read the
              stories that made them who they were. One payment covers {HOSTING_INCLUDED_YEARS} years of hosting, with no recurring fees.
              {physicalProducts.length === 0
                ? " Printed keepsakes are not available to order online right now. You can order a digital memorial page today. Metal plaques are coming soon."
                : " Order a keepsake that checkout accepts today, or a digital memorial page if nothing needs to ship. Metal plaques are on a separate waitlist."}
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
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-border backdrop-blur-sm">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Secure Checkout by Square</span>
              </div>
            </div>
          </div>

          <div id="digital-memorial" className="max-w-xl mx-auto">
            <Card className="bg-white border-border shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Digital Memorial Page</h2>
                <p className="text-3xl font-bold text-foreground mb-3">{formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)}</p>
                <p className="text-muted-foreground mb-6">
                  {physicalProducts.length === 0
                    ? `Order a digital memorial page today. You get an online page and a QR code you can print or share. You pay once. Nothing is shipped. Hosting for ${HOSTING_INCLUDED_YEARS} years is included. Metal plaques are coming soon. Join the list and we will email you once when one can be ordered.`
                    : `Order a digital memorial page if nothing needs to ship. You pay once, and hosting for ${HOSTING_INCLUDED_YEARS} years is included. Shop Keepsakes you can order today, or join the plaque list if you want a metal plaque.`}
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={DIGITAL_MEMORIAL_CHECKOUT_PATH}>
                    Order a Digital Memorial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  <Link href={DIGITAL_MEMORIAL_PATH} className="underline">
                    See what is included
                  </Link>
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" variant="outline">
                    <Link href={KEEPSAKE_COLLECTION_PATH}>
                      Shop Keepsakes
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  {plaquesWaiting ? (
                    <Button asChild size="lg" variant="outline">
                      <Link href="#plaque-waitlist">
                        Join the list
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  ) : null}
                  <Button asChild size="lg" variant="outline">
                    <Link href="/concierge">Have Us Build It</Link>
                  </Button>
                </div>
                {physicalProducts.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    <Link href={KEEPSAKE_COLLECTION_PATH} className="underline">
                      Keepsakes you can order
                    </Link>{" "}
                    lists only what checkout accepts today.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12">
        <nav aria-label="Digital memorial pages" className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">Order a digital memorial</h2>
          <p className="mb-4 text-muted-foreground">
            Each page below is about the {formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)} digital memorial. Nothing is
            shipped.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {digitalLandingList
              .filter((item) => !item.service)
              .map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="underline">
                    {item.h1}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <nav aria-label="Planning a service" className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">Planning a funeral or service</h2>
          <p className="mb-4 text-muted-foreground">
            These pages are for a family that needs a QR code before the service. Each one orders the same{" "}
            {formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)} digital memorial. Nothing is shipped.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {serviceLandingList.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="underline">
                  {item.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/funeral-homes" className="underline">
                For funeral homes
              </Link>
            </li>
          </ul>
        </nav>
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
          <SympathyGiftNav
            className="mt-8"
            heading="Sympathy gifts you can send today"
            intro={`For a friend, coworker, or relative buying the ${formatUsd(DIGITAL_MEMORIAL_PRODUCT.price)} digital memorial as a gift. Nothing is shipped. Checkout can record the recipient's name, email, and a short note.`}
            listClassName="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm"
          />
          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/pet-memorials" className="underline">
              Pet memorial QR codes
            </Link>
            {" · "}
            <Link href="/store" className="underline">
              QR memorial keepsakes
            </Link>
          </p>
        </nav>
      </section>

      <SellableProductGrid mode="available" title="Keepsakes you can order" />
      <PlaqueWaitlistSection />

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
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {physicalProducts.length === 0 ? "1. Join the list" : "1. Choose a Keepsake"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {physicalProducts.length === 0
                  ? "The QR plaques are coming soon. Leave your email and we will write once when one can be ordered."
                  : "Pick a QR keepsake, then upload photos, videos, and memories to build the memorial page."}
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

      <SisterShopNote layout="band" />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Create a Lasting Memorial?</h2>
            <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {physicalProducts.length === 0
              ? "The QR plaques are coming soon. Order a digital memorial page today, join the list to hear when a plaque can be ordered, or have us build the memorial page."
              : `Shop Keepsakes you can order today, or order a digital memorial page if nothing needs to ship. Metal plaques stay on the waitlist. Every keepsake includes ${HOSTING_INCLUDED_YEARS} years of hosting.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50 text-lg px-8">
              <Link href={DIGITAL_MEMORIAL_PATH}>
                Order a Digital Memorial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white/20 text-white hover:bg-white/30 border border-white/30 text-lg px-8">
              <Link href={KEEPSAKE_COLLECTION_PATH}>
                Shop Keepsakes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            {plaquesWaiting ? (
              <Button
                asChild
                size="lg"
                className="bg-white/20 text-white hover:bg-white/30 border border-white/30 text-lg px-8"
              >
                <Link href="#plaque-waitlist">
                  Join the list
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : null}

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
    </div>
  )
}
