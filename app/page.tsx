import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { CountdownTimer } from "@/components/countdown-timer"
import { HomepageStickyCTA } from "@/components/homepage-sticky-cta"
import { MemorialSlideshow } from "@/components/memorial-slideshow"
import { CustomerTestimonials } from "@/components/customer-testimonials"
import { Heart, QrCode, Shield, Clock, Users, ArrowRight, Play, Smartphone, Globe, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Military Background */}
      <section className="memorial-bg min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Hero Content */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow-lg">
                Honor Their Memory with a <span className="gradient-text">Digital Memorial</span>
              </h1>

              <div className="mb-8">
                <MemorialSlideshow />
              </div>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-shadow-lg">
                Create a beautiful QR code memorial plaque that connects visitors to photos, videos, and stories of your
                loved one's life.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 btn-hover-lift"
              >
                <Link href="/store">
                  Create Memorial Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 bg-transparent"
              >
                <Link href="/browse-memorials">
                  <Play className="mr-2 w-5 h-5" />
                  View Examples
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium drop-shadow-md">30-Day Guarantee</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium drop-shadow-md">Lifetime Access</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium drop-shadow-md">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Timer - Bottom Right */}
        <div className="absolute bottom-8 right-8 hidden lg:block">
          <CountdownTimer />
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/XsWR_-Yv96Y?autoplay=0&mute=0&controls=1&rel=0"
              title="Memorial QR Video"
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl border-2 border-border"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create a lasting digital memorial in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">1. Create Your Memorial</h3>
              <p className="text-muted-foreground">
                Upload photos, videos, and stories to create a beautiful digital memorial page for your loved one.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">2. Get Your QR Code</h3>
              <p className="text-muted-foreground">
                Receive a custom QR code that links directly to your memorial page, ready for your plaque.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">3. Share Their Story</h3>
              <p className="text-muted-foreground">
                Visitors can scan the QR code to view photos, videos, and memories, keeping their legacy alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our memorial plaques come with powerful features to honor your loved one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="memorial-card">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Unlimited Photos & Videos</h3>
                <p className="text-muted-foreground">
                  Upload unlimited photos and videos to create a comprehensive memorial.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Privacy Controls</h3>
                <p className="text-muted-foreground">
                  Control who can view and contribute to your loved one's memorial page.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Family Collaboration</h3>
                <p className="text-muted-foreground">
                  Invite family members to contribute photos, videos, and memories.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <QrCode className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Custom QR Codes</h3>
                <p className="text-muted-foreground">
                  Beautiful, customizable QR codes that match your memorial design.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Lifetime Hosting</h3>
                <p className="text-muted-foreground">
                  Your memorial page will be hosted forever, ensuring lasting access.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Guest Book</h3>
                <p className="text-muted-foreground">Allow visitors to leave messages and share their own memories.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <CustomerTestimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Honor Your Loved One?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Create a lasting digital memorial that celebrates their life and keeps their memory alive forever.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-md mx-auto">
            <p className="text-sm text-primary-foreground/80 mb-2">Starting at</p>
            <p className="text-5xl font-bold text-primary-foreground mb-2">$39.89</p>
            <p className="text-sm text-primary-foreground/80">One-time payment • Lifetime hosting</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4">
              <Link href="/store">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-4 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="memorial-logo text-xl font-bold">Memorial QR</span>
              </div>
              <p className="text-primary-foreground/70">
                Creating lasting digital memorials to honor and remember your loved ones.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link href="/how-it-works" className="hover:text-primary-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="hover:text-primary-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-primary-foreground">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link href="/our-story" className="hover:text-primary-foreground">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link href="/privacy-policy" className="hover:text-primary-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-primary-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/70">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <HomepageStickyCTA />
    </div>
  )
}
