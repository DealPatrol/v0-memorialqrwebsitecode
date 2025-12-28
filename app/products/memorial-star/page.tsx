import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { CheckCircle } from "lucide-react"

export default function MemorialStarPage() {
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
          <Link href="/how-it-works" className="hover:text-gray-600">
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

      {/* Breadcrumbs */}
      <div className="container mx-auto py-4">
        <div className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          /
          <Link href="/products" className="hover:text-gray-700 mx-1">
            Products
          </Link>{" "}
          /<span className="text-gray-900">Memorial Star</span>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="container mx-auto py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="bg-gray-50 rounded-lg p-8 relative">
            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 font-bold py-1 px-3 rounded-full">
              50% OFF TODAY!
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 relative aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src="/images/qr-code-sample.png"
                  alt="QR Code on Gravestone"
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-sm">
                  SCAN
                </div>
              </div>
              <div className="relative aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <Image src="/images/memorial-1.jpg" alt="Memorial Page" fill className="object-cover" />
              </div>
              <div className="relative aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <Image src="/images/memorial-2.jpg" alt="Memorial Page on Phone" fill className="object-cover" />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-sm">
                  MEMORIAL PAGE
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" className="w-full">
                100% MONEY-BACK GUARANTEE
              </Button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-8 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="border-2 border-gray-300 rounded-md overflow-hidden cursor-pointer hover:border-gray-500"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={i % 2 === 0 ? "/images/memorial-1.jpg" : "/images/qr-code-sample.png"}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center mb-2">
              <StarRating rating={4.9} />
              <span className="ml-2 text-gray-600">2,500+ Reviews</span>
            </div>
            <h1 className="text-3xl font-serif mb-4">The Memorial Star</h1>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 italic text-gray-700">
              "I wasn't sure if I really needed this, but wow... The moment I held it, I knew it was something special.
              The quality is amazing, and every time I see it, I feel connected. So glad I got this!" – Caroline
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-2xl font-bold mr-2">$49.99</span>
              <span className="text-gray-500 line-through">$99.99</span>
              <span className="ml-4 border border-blue-500 text-blue-500 px-3 py-1 rounded-full text-sm">
                One Time Payment
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Keep their memory alive</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Weather Proof</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited storage</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Private & Public Mode</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Easy customization</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-medium mb-4">Choose Quantity:</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border-2 border-gray-300 rounded-lg text-center">
                  <div className="font-bold mb-2">BUY 1</div>
                  <div className="relative w-full h-16 mb-2">
                    <Image src="/images/qr-code-sample.png" alt="QR Code on Gravestone" fill className="object-cover" />
                  </div>
                  <div className="font-bold">$49.99</div>
                  <div className="text-gray-500 line-through text-sm">$99.99</div>
                </Card>

                <Card className="p-4 border-2 border-blue-500 rounded-lg text-center relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-xs px-2 py-1 rounded-full">
                    POPULAR
                  </div>
                  <div className="font-bold mb-2">BUY 2</div>
                  <div className="relative w-full h-16 mb-2">
                    <Image src="/images/qr-code-sample.png" alt="QR Code on Gravestone" fill className="object-cover" />
                  </div>
                  <div className="font-bold">$79.98</div>
                  <div className="text-gray-500 line-through text-sm">$199.98</div>
                  <div className="bg-gray-800 text-white text-xs rounded-full py-1 px-2 mt-1">Save 20%</div>
                </Card>

                <Card className="p-4 border-2 border-gray-300 rounded-lg text-center">
                  <div className="font-bold mb-2">BUY 3</div>
                  <div className="relative w-full h-16 mb-2">
                    <Image src="/images/qr-code-sample.png" alt="QR Code on Gravestone" fill className="object-cover" />
                  </div>
                  <div className="font-bold">$112.48</div>
                  <div className="text-gray-500 line-through text-sm">$299.97</div>
                  <div className="bg-gray-800 text-white text-xs rounded-full py-1 px-2 mt-1">Save 25%</div>
                </Card>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 mb-8 text-center text-gray-600">
              *Each Memorial Star can be used to create a new memorial page or to link to an existing one.
            </div>

            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 text-lg">ADD TO CART</Button>

            <div className="flex items-center justify-center mt-4 text-gray-600">
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
              Get it between <strong>Apr 21st</strong> and <strong>Apr 23rd</strong>
            </div>

            <div className="mt-8 space-y-4">
              <details className="cursor-pointer">
                <summary className="font-medium flex justify-between items-center p-4 border rounded-lg">
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
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div className="mt-2 p-4 text-gray-600 border-t">
                  <p>Setting up your Memorial QR is simple:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-2">
                    <li>Purchase your Memorial Star QR code</li>
                    <li>Create your memorial page with photos, videos, and stories</li>
                    <li>Place the weather-resistant QR code on the headstone or memorial</li>
                    <li>Share the unique link with family and friends</li>
                  </ol>
                </div>
              </details>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-medium mb-4">Video Demonstration</h3>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  {/* Replace the src with your existing video URL */}
                  <video className="w-full h-full object-cover" controls poster="/images/video-thumbnail.jpg">
                    <source src="/videos/memorial-qr-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="mt-4 text-gray-600">
                  This video demonstrates how to set up and use your Memorial QR code, from installation to sharing
                  memories.
                </p>
              </div>

              <details className="cursor-pointer">
                <summary className="font-medium flex justify-between items-center p-4 border rounded-lg">
                  What's included?
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
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div className="mt-2 p-4 text-gray-600 border-t">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Weather-resistant QR code plaque</li>
                    <li>Lifetime access to memorial page</li>
                    <li>Unlimited photo and video storage</li>
                    <li>Easy-to-use memorial page editor</li>
                    <li>Visitor guestbook feature</li>
                    <li>Private or public sharing options</li>
                  </ul>
                </div>
              </details>

              <details className="cursor-pointer">
                <summary className="font-medium flex justify-between items-center p-4 border rounded-lg">
                  Shipping Information
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
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div className="mt-2 p-4 text-gray-600 border-t">
                  <p>We ship worldwide with the following options:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Standard Shipping: 5-7 business days</li>
                    <li>Express Shipping: 2-3 business days</li>
                    <li>Free shipping on orders over $100</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-serif text-center mb-8">You May Also Like</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={`/images/memorial-${i}.jpg`} alt={`Related Product ${i}`} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">
                    Memorial {i === 1 ? "Plaque" : i === 2 ? "Pendant" : i === 3 ? "Frame" : "Keychain"}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold">$29.99</div>
                    <Button size="sm">View</Button>
                  </div>
                </div>
              </Card>
            ))}
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
