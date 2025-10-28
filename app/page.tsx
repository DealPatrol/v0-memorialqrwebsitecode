import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { CountdownTimer } from "@/components/countdown-timer"
import { StarRating } from "@/components/star-rating"
import { HomepageStickyCTA } from "@/components/homepage-sticky-cta"
import { Heart, QrCode, Shield, Clock, Users, Star, ArrowRight, Play, Smartphone, Globe, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      {/* Hero Section with Military Background */}
      <section className="memorial-bg min-h-screen flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Hero Content */}
            <div className="mb-8 space-y-6">
              <Badge className="mb-4 bg-white/20 border-white/30 backdrop-blur-sm" style={{ color: "white" }}>
                ✨ Trusted by 10,000+ Families
              </Badge>

              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                Honor Their Memory with a <span className="gradient-text">Digital Memorial</span>
              </h1>

              <p
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
                style={{ color: "rgba(255,255,255,0.95)", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                Create a beautiful QR code memorial plaque that connects visitors to photos, videos, and stories of your
                loved one's life.
              </p>
            </div>

            {/* Star Rating */}
            <div className="mb-8 flex justify-center">
              <StarRating rating={5} showReviews={true} reviewCount={10247} size="lg" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 shadow-lg"
                style={{
                  background: "linear-gradient(to right, #9333ea, #3b82f6)",
                  color: "white",
                }}
              >
                <Link href="/pricing">
                  Create Memorial Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  backgroundColor: "transparent",
                }}
              >
                <Link href="/browse-memorials">
                  <Play className="mr-2 w-5 h-5" />
                  View Examples
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2" style={{ color: "rgba(255,255,255,0.9)" }}>
                <Shield className="w-5 h-5" style={{ color: "#4ade80" }} />
                <span className="text-sm font-medium" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}>
                  30-Day Guarantee
                </span>
              </div>
              <div className="flex items-center justify-center gap-2" style={{ color: "rgba(255,255,255,0.9)" }}>
                <Clock className="w-5 h-5" style={{ color: "#60a5fa" }} />
                <span className="text-sm font-medium" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}>
                  Lifetime Access
                </span>
              </div>
              <div className="flex items-center justify-center gap-2" style={{ color: "rgba(255,255,255,0.9)" }}>
                <Users className="w-5 h-5" style={{ color: "#a78bfa" }} />
                <span className="text-sm font-medium" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}>
                  24/7 Support
                </span>
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
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="video-container rounded-xl overflow-hidden shadow-2xl border-2 border-purple-200 mx-auto">
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

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create a lasting digital memorial in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">1. Create Your Memorial</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload photos, videos, and stories to create a beautiful digital memorial page for your loved one.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">2. Get Your QR Code</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive a custom QR code that links directly to your memorial page, ready for your plaque.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">3. Share Their Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visitors can scan the QR code to view photos, videos, and memories, keeping their legacy alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our memorial plaques come with powerful features to honor your loved one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:border-purple-300 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Unlimited Photos & Videos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload unlimited photos and videos to create a comprehensive memorial.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:border-purple-300 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Privacy Controls</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Control who can view and contribute to your loved one's memorial page.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:border-purple-300 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Family Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invite family members to contribute photos, videos, and memories.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:border-purple-300 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Custom QR Codes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beautiful, customizable QR codes that match your memorial design.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:border-purple-300 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Lifetime Hosting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your memorial page will be hosted forever, ensuring lasting access.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:border-purple-300 bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Guest Book</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Allow visitors to leave messages and share their own memories.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">What Families Say</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Hear from families who have honored their loved ones with Memorial QR
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-purple-200 shadow-lg bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" style={{ fill: "#facc15", color: "#facc15" }} />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "Memorial QR helped us create a beautiful tribute to my father. The QR code on his headstone allows
                  visitors to see his life story and photos."
                </p>
                <div>
                  <div className="font-semibold text-foreground">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Verified Customer</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" style={{ fill: "#facc15", color: "#facc15" }} />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "The process was so easy and the support team was incredibly helpful. Our family can now share
                  memories and photos in one place."
                </p>
                <div>
                  <div className="font-semibold text-foreground">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Verified Customer</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 shadow-lg bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" style={{ fill: "#facc15", color: "#facc15" }} />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "What a wonderful way to keep mom's memory alive. Friends and family love being able to access her
                  photos and stories anytime."
                </p>
                <div>
                  <div className="font-semibold text-foreground">Lisa Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Verified Customer</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Ready to Honor Your Loved One?</h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Create a lasting digital memorial that celebrates their life and keeps their memory alive forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-lg"
            >
              <Link href="/pricing">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="memorial-logo text-xl font-bold">Memorial QR</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Creating lasting digital memorials to honor and remember your loved ones.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white transition-colors">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/our-story" className="hover:text-white transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <HomepageStickyCTA />
    </div>
  )
}
