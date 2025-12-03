import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { UrgencyBanner } from "@/components/urgency-banner"
import { TrustBadges } from "@/components/trust-badges"

export default function PricingPage() {
  const packages = [
    {
      id: "starter",
      name: "Starter Package",
      price: 39.89,
      popular: false,
      storage: "500 MB",
      plaques: 1,
      features: [
        "500 MB storage space",
        "1 premium QR plaque (Gold, Silver, or Black)",
        "Unlimited photos, videos & audio files",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code design",
        "Lifetime hosting included",
      ],
    },
    {
      id: "basic",
      name: "Basic Package",
      price: 89.89,
      popular: false,
      storage: "1 GB",
      plaques: 1,
      features: [
        "1 GB storage space",
        "1 premium QR plaque (Gold, Silver, or Black)",
        "Unlimited photos, videos & audio files",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code design",
        "Lifetime hosting included",
      ],
    },
    {
      id: "standard",
      name: "Standard Package",
      price: 129.89,
      popular: true,
      storage: "2 GB",
      plaques: 2,
      features: [
        "2 GB storage space",
        "2 premium QR plaques (Gold, Silver, or Black)",
        "Unlimited photos, videos & audio files",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code design",
        "Lifetime hosting included",
        "Priority email support",
      ],
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 199.89,
      popular: false,
      storage: "5 GB",
      plaques: 3,
      features: [
        "5 GB storage space",
        "3 premium QR plaques (Gold, Silver, or Black)",
        "Unlimited photos, videos & audio files",
        "Unlimited guest messages",
        "Family tree display",
        "Easy social media sharing",
        "Custom QR code design",
        "Lifetime hosting included",
        "Priority phone & email support",
        "Wooden keychain or necklace option",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      <UrgencyBanner />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose Your Memorial Package</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create a beautiful, lasting tribute with unlimited content. All packages include lifetime hosting and
            premium QR plaques with no hidden fees.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                  <div className="flex flex-col gap-2 mt-4">
                    <Badge variant="outline" className="text-sm font-semibold py-1">
                      {pkg.storage} Storage
                    </Badge>
                    <Badge variant="outline" className="text-sm font-semibold py-1">
                      {pkg.plaques} {pkg.plaques === 1 ? "Plaque" : "Plaques"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
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
                    <Link href={`/checkout/simple?package=${pkg.id}`}>Get Started</Link>
                  </Button>

                  <p className="text-sm text-gray-500 mt-4 text-center">30-Day Money-Back Guarantee</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">All Packages Include:</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Unlimited Files</p>
                <p className="text-sm text-gray-600">Upload as many photos, videos & audio as your storage allows</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Premium Plaques</p>
                <p className="text-sm text-gray-600">Beautiful QR plaques in Gold, Silver, or Black finish</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Lifetime Hosting</p>
                <p className="text-sm text-gray-600">No monthly fees, no renewals • Keep forever</p>
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

      <TrustBadges />
    </div>
  )
}
