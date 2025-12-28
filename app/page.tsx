"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { CheckCircle } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { CartButton } from "@/components/cart-button"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  return (
    <div className="bg-rose-600 min-h-screen">
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Header - Keep your existing navigation links */}
      <header className="bg-rose-700 text-white py-6 border-b border-rose-500 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <button className="lg:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
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
          {/* IMPORTANT: Replace these with your actual navigation links */}
          <div className="hidden lg:flex space-x-6 flex-grow justify-center">
            <Link href="/memorials" className="hover:text-rose-200 transition-colors">
              Memorials
            </Link>
            <Link href="/how-it-works" className="hover:text-rose-200 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="hover:text-rose-200 transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Keep your existing authentication links */}
            <Link href="/login" className="text-rose-100 hover:text-white transition-colors">
              Login
            </Link>
            <CartButton />
          </div>
        </div>
      </header>

      {/* Main Product Section */}
      <main className="container mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-2 border-rose-300">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Video */}
            <div className="bg-rose-50 rounded-lg p-8 relative border border-rose-200">
              <div className="absolute top-4 right-4 bg-yellow-400 text-rose-900 font-bold py-1 px-3 rounded-full z-10 border-2 border-rose-500">
                50% OFF TODAY!
              </div>
              <div className="flex justify-center items-center">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-md overflow-hidden border border-rose-200">
                  <video
                    className="w-full aspect-video object-cover"
                    style={{ minHeight: "350px" }}
                    controls
                    playsInline
                    preload="auto"
                    poster="/images/qr-code-gravestone.png"
                  >
                    <source src="/videos/revolutionizing-remembrance.mp4" type="video/mp4" />
                    <source src="/videos/memorial-qr-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button variant="rose-outline" className="w-full">
                  100% MONEY-BACK GUARANTEE
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-center mb-2">
                <StarRating rating={4.9} />
                <span className="ml-2 text-rose-800">2,500+ Reviews</span>
              </div>
              <h1 className="text-3xl font-serif mb-4 text-rose-900">The Memorial Star</h1>
              <div className="bg-rose-50 p-4 rounded-lg mb-6 italic text-rose-700 border-l-4 border-rose-400">
                "I wasn't sure if I really needed this, but wow... The moment I held it, I knew it was something
                special. The quality is amazing, and every time I see it, I feel connected. So glad I got this!" –
                Caroline
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-bold mr-2 text-rose-900">$49.99</span>
                <span className="text-rose-500 line-through">$99.99</span>
                <span className="ml-4 border border-rose-400 text-rose-700 px-3 py-1 rounded-full text-sm bg-rose-50">
                  One Time Payment
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-rose-900">Keep their memory alive</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-rose-900">Weather Proof</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-rose-900">Unlimited storage</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-rose-900">Private & Public Mode</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-rose-900">Lifetime Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-rose-500 mr-2" />
                  <span className="text-rose-900">Easy customization</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium mb-4 text-rose-900">Choose Quantity:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 border-2 border-rose-200 rounded-lg text-center hover:border-rose-400 transition-colors">
                    <div className="font-bold mb-2 text-rose-800">BUY 1</div>
                    <div className="relative w-full h-16 mb-2">
                      <Image
                        src="/images/qr-code-gravestone.png"
                        alt="QR Code on Gravestone"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-bold text-rose-900">$49.99</div>
                    <div className="text-rose-500 line-through text-sm">$99.99</div>
                  </Card>

                  <Card className="p-4 border-2 border-rose-400 rounded-lg text-center relative bg-rose-50">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-xs px-2 py-1 rounded-full border border-rose-500 text-rose-900">
                      POPULAR
                    </div>
                    <div className="font-bold mb-2 text-rose-800">BUY 2</div>
                    <div className="relative w-full h-16 mb-2">
                      <Image
                        src="/images/qr-code-gravestone.png"
                        alt="QR Code on Gravestone"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-bold text-rose-900">$79.98</div>
                    <div className="text-rose-500 line-through text-sm">$199.98</div>
                    <div className="bg-rose-700 text-white text-xs rounded-full py-1 px-2 mt-1">Save 20%</div>
                  </Card>

                  <Card className="p-4 border-2 border-rose-200 rounded-lg text-center hover:border-rose-400 transition-colors">
                    <div className="font-bold mb-2 text-rose-800">BUY 3</div>
                    <div className="relative w-full h-16 mb-2">
                      <Image
                        src="/images/qr-code-gravestone.png"
                        alt="QR Code on Gravestone"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-bold text-rose-900">$112.48</div>
                    <div className="text-rose-500 line-through text-sm">$299.97</div>
                    <div className="bg-rose-700 text-white text-xs rounded-full py-1 px-2 mt-1">Save 25%</div>
                  </Card>
                </div>
              </div>

              <div className="border border-rose-200 bg-rose-50 rounded-lg p-4 mb-8 text-center text-rose-700">
                *Each Memorial Star can be used to create a new memorial page or to link to an existing one.
              </div>

              <Button className="w-full bg-rose-700 hover:bg-rose-800 text-white py-3 text-lg" asChild>
                <Link href="/checkout">BUY NOW</Link>
              </Button>

              <div className="flex items-center justify-center mt-4 text-rose-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                Get it between <strong className="text-rose-900">Apr 21st</strong> and{" "}
                <strong className="text-rose-900">Apr 23rd</strong>
              </div>

              <div className="mt-8 border-t border-rose-200 pt-4">
                <details className="cursor-pointer group">
                  <summary className="font-medium flex justify-between items-center text-rose-800 hover:text-rose-900">
                    How to set it up?
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-rose-500 group-hover:text-rose-700"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </summary>
                  <div className="mt-2 text-rose-700 bg-rose-50 p-4 rounded-lg border-l-4 border-rose-300">
                    <p>Setting up your Memorial QR is simple:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2">
                      <li>Purchase your Memorial Star QR code</li>
                      <li>Create your memorial page with photos, videos, and stories</li>
                      <li>Place the weather-resistant QR code on the headstone or memorial</li>
                      <li>Share the unique link with family and friends</li>
                    </ol>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="bg-rose-500 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="p-6 bg-white text-gray-800 border-2 border-rose-300 hover:border-rose-400 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <StarRating rating={5} />
                  <span className="ml-2 text-rose-500 font-medium">Verified Purchase</span>
                </div>
                <p className="my-4 italic text-rose-900 border-l-4 border-rose-300 pl-4">
                  "The Memorial QR code has been such a meaningful way to preserve my father's memory. Visitors to his
                  grave can scan the code and see photos, videos, and read stories about his life. It's like his legacy
                  lives on in a digital space."
                </p>
                <div className="font-medium text-rose-800">
                  - Sarah {i === 1 ? "Johnson" : i === 2 ? "Miller" : "Thompson"}
                </div>
                <div className="mt-4 text-sm text-rose-600">
                  Purchased {i === 1 ? "2" : i === 2 ? "3" : "1"} months ago
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rose-800 text-white py-12 border-t border-rose-700">
        <div className="container mx-auto grid md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-xl font-serif mb-4 text-rose-100">Memorial QR</h3>
            <p className="text-rose-200">Preserving memories for generations to come with innovative QR technology.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-rose-100">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/memorials" className="text-rose-300 hover:text-white transition-colors">
                  Memorials
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-rose-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-rose-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-rose-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-rose-100">Customer Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-rose-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-rose-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-rose-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-rose-100">Newsletter</h4>
            <p className="text-rose-200 mb-4">Subscribe to receive updates and special offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-900 border-2 border-rose-300 focus:border-rose-400"
              />
              <Button className="rounded-l-none bg-rose-600 hover:bg-rose-700 border-2 border-rose-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-rose-700 text-center text-rose-300">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
