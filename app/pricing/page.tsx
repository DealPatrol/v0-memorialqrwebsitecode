import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { CartButton } from "@/components/cart-button"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto py-6 flex justify-between items-center border-b">
        <button className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="text-center flex-grow lg:flex-grow-0">
          <Link href="/" className="text-2xl font-serif flex items-center justify-center">
            Memorial QR
            <span className="text-yellow-400 ml-1">★</span>
          </Link>
        </div>
        <div className="hidden lg:flex space-x-6 flex-grow justify-center">
          <Link href="/memorials" className="hover:text-gray-600">
            Memorials
          </Link>
          <Link href="/how-it-works" className="hover:text-gray-600">
            How It Works
          </Link>
          <Link href="/pricing" className="text-gray-900 font-medium">
            Pricing
          </Link>
          <Link href="/contact" className="hover:text-gray-600">
            Contact
          </Link>
        </div>
        <CartButton />
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-serif mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan to preserve and share your loved one's memories for generations to come.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan - Now Premium */}
            <Card className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-serif mb-2">Premium</h2>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$49.99</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                <p className="text-gray-600">Perfect for a simple memorial tribute.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>1 QR code for headstone or memorial</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Basic memorial page</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Up to 20 photos</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>1 video upload</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Basic visitor guestbook</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>5 years of hosting included</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="relative w-full h-32 mb-6">
                  <Image
                    src="/images/qr-code-gravestone.png"
                    alt="QR Code on Gravestone"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/checkout?plan=premium">Choose Premium</Link>
                </Button>
              </div>
            </Card>

            {/* Standard Plan - Now Deluxe */}
            <Card className="border-2 border-blue-500 rounded-xl overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              <div className="p-6 border-b bg-blue-50">
                <h2 className="text-2xl font-serif mb-2">Deluxe</h2>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$79.99</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                <p className="text-gray-600">Our most popular comprehensive memorial package.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>1 Weather-resistant QR code</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Enhanced memorial page</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Unlimited photos</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Up to 5 video uploads</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Interactive timeline</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Family tree feature</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Lifetime hosting included</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="relative w-full h-32 mb-6">
                  <Image
                    src="/images/qr-code-gravestone.png"
                    alt="QR Code on Gravestone"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                  <Link href="/checkout?plan=deluxe">Choose Deluxe</Link>
                </Button>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-serif mb-2">Legacy</h2>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$99.99</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                <p className="text-gray-600">The ultimate memorial experience for your loved one.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>3 Premium QR codes (different designs)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Deluxe memorial page</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Unlimited photos & videos</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Audio tributes & voice messages</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Interactive family tree</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Custom domain name</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Lifetime hosting & premium support</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="relative w-full h-32 mb-6">
                  <Image
                    src="/images/qr-code-gravestone.png"
                    alt="QR Code on Gravestone"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/checkout?plan=legacy">Choose Legacy</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-white p-6 rounded-lg shadow-sm">
              <summary className="font-medium text-lg cursor-pointer">What's included in each plan?</summary>
              <div className="mt-4 text-gray-600">
                <p>
                  Each plan includes a unique QR code that links to a digital memorial page. The differences between
                  plans are in the number of QR codes, storage capacity, features, and hosting duration. All plans
                  include our weather-resistant QR code technology.
                </p>
              </div>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-sm">
              <summary className="font-medium text-lg cursor-pointer">
                How long will my memorial page be available?
              </summary>
              <div className="mt-4 text-gray-600">
                <p>
                  The Essential plan includes 5 years of hosting, while both Premium and Legacy plans include lifetime
                  hosting. After the initial period for the Essential plan, you can renew for a small fee to maintain
                  your memorial page.
                </p>
              </div>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-sm">
              <summary className="font-medium text-lg cursor-pointer">Can I upgrade my plan later?</summary>
              <div className="mt-4 text-gray-600">
                <p>
                  Yes, you can upgrade from Essential to Premium or Legacy at any time. You'll only pay the difference
                  between your current plan and the new plan. All your existing content will be preserved during the
                  upgrade.
                </p>
              </div>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-sm">
              <summary className="font-medium text-lg cursor-pointer">How durable are the QR codes?</summary>
              <div className="mt-4 text-gray-600">
                <p>
                  Our QR codes are made with weather-resistant materials designed to withstand outdoor conditions for
                  years. They're UV-resistant, waterproof, and can handle temperature extremes. The Premium and Legacy
                  plans include our highest quality materials for maximum durability.
                </p>
              </div>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-sm">
              <summary className="font-medium text-lg cursor-pointer">
                Can family members add content to the memorial?
              </summary>
              <div className="mt-4 text-gray-600">
                <p>
                  Yes, all plans allow you to invite family members to contribute stories, photos, and memories. The
                  Premium and Legacy plans offer more advanced permission controls, allowing you to decide who can view
                  and who can contribute to different sections of the memorial.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-serif mb-6">Ready to Create a Lasting Memorial?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the plan that's right for you and start preserving memories today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
              <Link href="/checkout">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-gray-800">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto grid md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-xl font-serif mb-4">Memorial QR</h3>
            <p className="text-gray-400">Preserving memories for generations to come with innovative QR technology.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/memorials" className="text-gray-400 hover:text-white">
                  Memorials
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Customer Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to receive updates and special offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-900"
              />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
