import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HowItWorksPage() {
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
          <Link href="/products" className="hover:text-gray-600">
            Products
          </Link>
          <Link href="/how-it-works" className="text-gray-900 font-medium">
            How It Works
          </Link>
          <Link href="/testimonials" className="hover:text-gray-600">
            Testimonials
          </Link>
          <Link href="/contact" className="hover:text-gray-600">
            Contact
          </Link>
        </div>
        <Link href="/cart">
          <div className="relative">
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              0
            </span>
          </div>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-serif mb-6">How Memorial QR Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our innovative QR code technology connects physical memorials with digital memories, creating a lasting
            tribute that can be accessed for generations to come.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/qr-code-sample.png" alt="Choose your Memorial QR" fill className="object-cover" />
            </div>
            <div>
              <div className="inline-block bg-gray-900 text-white text-4xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                1
              </div>
              <h2 className="text-3xl font-serif mb-4">Choose Your Memorial QR</h2>
              <p className="text-gray-600 mb-6">
                Select from our range of durable, weather-resistant QR code options designed to be placed on headstones,
                plaques, urns, or any memorial location. Each QR code is uniquely linked to your loved one's digital
                memorial page.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Weather-resistant and durable
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Multiple design options
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Easy to install
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-gray-900 text-white text-4xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                2
              </div>
              <h2 className="text-3xl font-serif mb-4">Create the Memorial Page</h2>
              <p className="text-gray-600 mb-6">
                Use our intuitive editor to build a beautiful digital memorial. Add photos, videos, stories,
                biographical information, and more to celebrate your loved one's life and legacy.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited photos and videos
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Family tree integration
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Visitor guestbook
                </li>
              </ul>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden order-1 md:order-2">
              <Image src="/images/memorial-1.jpg" alt="Create the Memorial Page" fill className="object-cover" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/memorial-3.jpg" alt="Share and Remember" fill className="object-cover" />
            </div>
            <div>
              <div className="inline-block bg-gray-900 text-white text-4xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                3
              </div>
              <h2 className="text-3xl font-serif mb-4">Share and Remember</h2>
              <p className="text-gray-600 mb-6">
                Visitors can scan the QR code with any smartphone to instantly access the memorial page. Family and
                friends can view memories, add their own tributes, and stay connected to your loved one's legacy.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Private or public sharing options
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Visitor contributions
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Lifetime access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Watch Our Tutorial</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our Memorial QR codes work and how they can help preserve the memory of your loved ones.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/RyGH38lunSM"
                title="Preserving Memories QR Codes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-block bg-gray-900 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mb-2">
                  1
                </div>
                <h3 className="font-medium mb-2">Choose Your QR Code</h3>
                <p className="text-gray-600 text-sm">Select the perfect QR code design for your memorial.</p>
              </div>

              <div className="text-center">
                <div className="inline-block bg-gray-900 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mb-2">
                  2
                </div>
                <h3 className="font-medium mb-2">Create Your Memorial</h3>
                <p className="text-gray-600 text-sm">Build a beautiful digital memorial with photos and stories.</p>
              </div>

              <div className="text-center">
                <div className="inline-block bg-gray-900 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mb-2">
                  3
                </div>
                <h3 className="font-medium mb-2">Share & Remember</h3>
                <p className="text-gray-600 text-sm">
                  Anyone can scan the QR code to view and contribute to the memorial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12">Features & Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Preserves Memories",
                description: "Create a lasting digital legacy that can be accessed by future generations.",
                icon: (
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
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                ),
              },
              {
                title: "Easy to Use",
                description: "Simple setup process with an intuitive editor that anyone can use.",
                icon: (
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                ),
              },
              {
                title: "Weather Resistant",
                description: "Durable QR codes designed to withstand outdoor conditions for years to come.",
                icon: (
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
                    <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path>
                    <path d="M16 14v2"></path>
                    <path d="M8 14v2"></path>
                    <path d="M12 16v2"></path>
                  </svg>
                ),
              },
              {
                title: "Unlimited Storage",
                description: "Add as many photos, videos, and stories as you want with no storage limits.",
                icon: (
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                ),
              },
              {
                title: "Privacy Controls",
                description: "Choose between public access or private sharing with only family and friends.",
                icon: (
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                ),
              },
              {
                title: "Lifetime Access",
                description: "One-time payment for permanent access to your memorial page.",
                icon: (
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-900 p-3 rounded-full text-white mr-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-serif mb-6">Ready to Create a Lasting Memorial?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Honor your loved one with a digital memorial that preserves their memory for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products/memorial-star">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-gray-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Memorial QR</h3>
            <p className="text-gray-400">Preserving memories for generations to come with innovative QR technology.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-400 hover:text-white">
                  Testimonials
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
