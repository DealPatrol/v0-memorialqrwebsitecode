import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Heart, QrCode, Shield, Clock, Users, ArrowRight, Globe, Lock, User, Flag, Music, Camera } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Human Memorials - Memorial QR",
  description:
    "Create beautiful digital memorials for loved ones. QR code headstone plaques, wall tributes, and lasting digital legacies.",
}

export default function HumanMemorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24">
        <div className="absolute inset-0 bg-[url('/peaceful-cemetery-memorial-garden.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-blue-600/20 text-blue-200 border-blue-400/30">
            <User className="w-4 h-4 mr-2" />
            Human Memorials
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Honor Their <span className="text-blue-400">Legacy</span> Forever
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Create dignified digital memorials for parents, grandparents, veterans, and all those who touched our lives.
            A scannable QR code connects to their complete life story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/pricing?type=human">
                Create Memorial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/browse-memorials?type=human">View Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-slate-100 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Lifetime Hosting Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              <span>Veteran Discounts Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything to Honor Their Memory</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our human memorial packages include features designed for dignified remembrance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Full Life Timeline</h3>
                <p className="text-muted-foreground">
                  Create a complete biography with birth, education, career, marriage, and milestones.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Camera className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Photo & Video Gallery</h3>
                <p className="text-muted-foreground">
                  Upload unlimited photos and videos spanning their entire life journey.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Music className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Audio Memories</h3>
                <p className="text-muted-foreground">
                  Include voice recordings, favorite songs, or spoken tributes from family.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Family Tree</h3>
                <p className="text-muted-foreground">
                  Document their lineage with parents, siblings, children, and grandchildren.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Condolence Messages</h3>
                <p className="text-muted-foreground">
                  Visitors can leave heartfelt messages and share their own memories.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <Lock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Privacy Controls</h3>
                <p className="text-muted-foreground">
                  Choose public, private, or family-only access for sensitive content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Options */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Memorial Products</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from headstone plaques, wall tributes, or keepsake items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-slate-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Headstone Plaque</h3>
                <p className="text-muted-foreground mb-4">
                  Weather-resistant aluminum plaque designed to mount on headstones and grave markers.
                </p>
                <Badge>Most Popular</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-slate-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wall Memorial</h3>
                <p className="text-muted-foreground mb-4">
                  Elegant framed QR display for home, funeral homes, or memorial walls.
                </p>
                <Badge variant="outline">Indoor Display</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-slate-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Keepsake Box</h3>
                <p className="text-muted-foreground mb-4">
                  Beautiful wooden box with engraved QR code lid for storing cherished mementos.
                </p>
                <Badge variant="outline">Premium Option</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Create a Lasting Tribute</h2>
          <p className="text-xl text-white/90 mb-8">
            Honor their memory with a beautiful digital memorial that generations can visit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/pricing?type=human">
                View Packages
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Speak with Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
