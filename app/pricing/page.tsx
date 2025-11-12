import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const packages = [
    {
      id: "basic",
      name: "Basic Package",
      price: 1.0,
      popular: false,
      features: [
        "3 videos",
        "10 voicemails/audio files",
        "30 photos",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code",
        "Choice of Gold, Black, or Silver plaque",
        "Lifetime hosting included",
      ],
    },
    {
      id: "standard",
      name: "Standard Package",
      price: 2.0,
      popular: true,
      features: [
        "5 videos",
        "15 voicemails/audio files",
        "50 photos",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code",
        "Choice of Gold, Black, or Silver plaque",
        "Lifetime hosting included",
      ],
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 3.0,
      popular: false,
      features: [
        "10 videos",
        "30 voicemails/audio files",
        "100 photos",
        "3 different plaques OR wooden keychain/necklace",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code",
        "Lifetime hosting included",
        "Priority support",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose Your Memorial Package</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create a beautiful, lasting tribute for your loved one. All packages include lifetime hosting with no hidden
            fees or monthly charges.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative ${
                  pkg.popular
                    ? "border-4 border-purple-500 shadow-2xl scale-105"
                    : "border-2 border-purple-200 shadow-xl"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="flex justify-center items-baseline mb-2">
                    <span className="text-5xl font-bold text-gray-900">${pkg.price}</span>
                  </div>
                  <CardDescription className="text-base">One-time payment • Lifetime access</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className={`w-full text-lg py-6 ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    <Link href={`/checkout/add-ons?package=${pkg.id}`}>Get Started</Link>
                  </Button>

                  <p className="text-sm text-gray-500 mt-4 text-center">30-Day Money-Back Guarantee</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">All Packages Include:</h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Lifetime Hosting</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">No Monthly Fees</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Free Shipping</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">24/7 Access</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Questions about our packages?</p>
            <Link href="/faq" className="text-purple-600 hover:text-purple-700 font-medium">
              View Frequently Asked Questions →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
