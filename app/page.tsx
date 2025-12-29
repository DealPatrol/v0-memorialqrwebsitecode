import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { CountdownTimer } from "@/components/countdown-timer"
import { HomepageStickyCTA } from "@/components/homepage-sticky-cta"
import { MemorialSlideshow } from "@/components/memorial-slideshow"
import { CustomerTestimonials } from "@/components/customer-testimonials"
import {
  Heart,
  QrCode,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Play,
  Smartphone,
  Globe,
  Lock,
  PawPrint,
  User,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Unified Memorial */}
      <section className="memorial-bg min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Hero Content */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow-lg">
                Honor Those You Love with a <span className="gradient-text">Digital Memorial</span>
              </h1>

              <div className="mb-8">
                <MemorialSlideshow />
              </div>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-shadow-lg">
                Create beautiful QR code memorials that connect to photos, videos, and stories — for loved ones and
                beloved pets alike.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                <Link href="/human-memorials">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Human Memorials</h3>
                    <p className="text-white/80 mb-4">Honor the legacy of loved ones who have passed</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full">
                      Create Memorial
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                <Link href="/pet-memorials">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <PawPrint className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Pet Memorials</h3>
                    <p className="text-white/80 mb-4">Celebrate the unconditional love of your furry friends</p>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 w-full">
                      Create Memorial
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </div>

            {/* Secondary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

            {/* Trust Indicators - Updated for both services */}
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
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium drop-shadow-md">For All Loved Ones</span>
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
          <div className="video-container rounded-lg overflow-hidden shadow-2xl border-2 border-border mx-auto">
            <iframe
              src="https://www.youtube.com/embed/XsWR_-Yv96Y?autoplay=0&mute=0&controls=1&rel=0"
              title="Memorial QR Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - Updated for unified service */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create a lasting tribute for your loved ones in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">1. Create Their Profile</h3>
              <p className="text-muted-foreground">
                Upload photos, videos, and cherished memories to create a beautiful digital memorial page.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">2. Get Your Memorial</h3>
              <p className="text-muted-foreground">
                Receive a custom QR code plaque, headstone tag, or collar tag that links directly to their memorial.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">3. Share Their Legacy</h3>
              <p className="text-muted-foreground">
                Friends and family can scan the QR code to view memories and share their own stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated for unified service */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our memorials come with powerful features to honor those you love
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
                <p className="text-muted-foreground">Control who can view and contribute to your memorial page.</p>
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
                <User className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Human Memorials</h3>
                <p className="text-muted-foreground">
                  Honor veterans, parents, grandparents, and all those who touched our lives.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <PawPrint className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Pet Memorials</h3>
                <p className="text-muted-foreground">
                  Celebrate dogs, cats, horses, and all the furry friends who gave us unconditional love.
                </p>
              </CardContent>
            </Card>

            <Card className="memorial-card">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Lifetime Hosting</h3>
                <p className="text-muted-foreground">
                  Your memorial page will be hosted forever, ensuring lasting access for generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <CustomerTestimonials />

      {/* CTA Section - Updated messaging */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Create a Lasting Memorial?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Whether honoring a loved one or a beloved pet, create a beautiful digital memorial that keeps their memory
            alive forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4">
              <Link href="/pricing">
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

      {/* Footer - Updated branding */}
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
                Creating lasting digital memorials to honor and remember your loved ones — both human and pet.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link href="/human-memorials" className="hover:text-primary-foreground">
                    Human Memorials
                  </Link>
                </li>
                <li>
                  <Link href="/pet-memorials" className="hover:text-primary-foreground">
                    Pet Memorials
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary-foreground">
                    Pricing
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
                  <Link href="/how-it-works" className="hover:text-primary-foreground">
                    How It Works
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
