import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Heart, QrCode, Shield, Clock, ArrowRight, Globe, Lock, PawPrint, Music, Camera, Bone } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pet Memorials - Memorial QR",
  description:
    "Create beautiful digital memorials for beloved pets. QR collar tags, garden stones, and lasting tributes for dogs, cats, and all furry friends.",
}

export default function PetMemorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 py-24">
        <div className="absolute inset-0 bg-[url('/peaceful-garden-with-flowers-memorial.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-amber-600/20 text-amber-200 border-amber-400/30">
            <PawPrint className="w-4 h-4 mr-2" />
            Pet Memorials
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Celebrate Their <span className="text-amber-400">Unconditional Love</span>
          </h1>
          <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Create heartfelt digital memorials for dogs, cats, horses, and all the furry friends who gave us
            unconditional love. A scannable QR code keeps their memory alive forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Link href="/pricing?type=pet">
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
              <Link href="/browse-memorials?type=pet">View Examples</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-amber-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Lifetime Hosting Included</span>
            </div>
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-orange-600" />
              <span>For All Pets - Dogs, Cats, Horses & More</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Celebrate Their Unique Spirit</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our pet memorial packages include features designed to honor your furry friend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardContent className="p-6">
                <Camera className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Photo & Video Gallery</h3>
                <p className="text-muted-foreground">
                  Upload photos from puppy/kitten days to their golden years, plus videos of them playing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardContent className="p-6">
                <Music className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Barks, Purrs & Sounds</h3>
                <p className="text-muted-foreground">
                  Include audio recordings of their unique bark, purr, whinny, or chirp.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardContent className="p-6">
                <Bone className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Pet Profile</h3>
                <p className="text-muted-foreground">
                  Document their breed, favorite toys, treats, personality quirks, and funny habits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Life Story</h3>
                <p className="text-muted-foreground">
                  Share how they came into your life, adventures together, and favorite memories.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Visitor Messages</h3>
                <p className="text-muted-foreground">
                  Friends and family can leave condolences and share their own memories of your pet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardContent className="p-6">
                <Lock className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Privacy Controls</h3>
                <p className="text-muted-foreground">Choose public or private access for your pet's memorial page.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Options */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Memorial Products</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from collar tags, garden stones, or keepsake items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-amber-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Collar Tag</h3>
                <p className="text-muted-foreground mb-4">
                  Durable stainless steel QR tag that attaches to their old collar as a keepsake.
                </p>
                <Badge className="bg-amber-100 text-amber-800">Most Popular</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-amber-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Garden Stone</h3>
                <p className="text-muted-foreground mb-4">
                  Weather-resistant memorial stone perfect for gardens, yards, or their favorite spot.
                </p>
                <Badge variant="outline" className="border-amber-400 text-amber-700">
                  Outdoor
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-amber-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Keepsake Box</h3>
                <p className="text-muted-foreground mb-4">
                  Beautiful wooden box with QR code for storing collar, toys, and cherished items.
                </p>
                <Badge variant="outline" className="border-amber-400 text-amber-700">
                  Premium
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Honor Your Best Friend</h2>
          <p className="text-xl text-white/90 mb-8">
            Create a lasting memorial that celebrates their unconditional love and keeps their spirit alive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
              <Link href="/pricing?type=pet">
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
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
