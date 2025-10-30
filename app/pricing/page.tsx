import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            Limited Time - Save $50!
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to create a beautiful memorial for your loved one. No hidden fees, no monthly charges.
          </p>

          <Card className="max-w-md mx-auto border-2 border-purple-200 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center items-baseline mb-4">
                <span className="text-5xl font-bold text-gray-900">$149</span>
                <span className="text-xl text-gray-500 line-through ml-2">$199</span>
              </div>
              <CardTitle className="text-2xl">Complete Memorial Package</CardTitle>
              <CardDescription className="text-lg">Everything included - no additional costs</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom QR Memorial Plaque</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Digital Memorial Website</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited Photos & Videos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Lifetime Hosting Included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Family Collaboration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Guest Message Book</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Free Shipping</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>30-Day Money-Back Guarantee</span>
                </li>
              </ul>

              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
              >
                <Link href="/checkout">Create Memorial Now - $149</Link>
              </Button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                One-time payment • No recurring fees • Lifetime access
              </p>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Questions about our pricing?</p>
            <Link href="/faq" className="text-purple-600 hover:text-purple-700 font-medium">
              View Frequently Asked Questions →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
