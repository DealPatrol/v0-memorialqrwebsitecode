import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, Users, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Story - Built with Love for Grandma Glenda | Memorial QR",
  description:
    "The personal story behind Memorial QR. Founded by Cole Collins to honor his grandmother Glenda Kelso and help families preserve precious memories forever.",
  keywords:
    "memorial QR story, founder story, why memorial QR, Glenda Kelso, Cole Collins, memorial inspiration, family memorial",
  openGraph: {
    title: "Our Story - Why We Built Memorial QR",
    description:
      "Founded by Cole Collins to honor his grandmother Glenda Kelso. Learn the personal story behind our mission to preserve memories forever.",
    type: "website",
    url: "https://memorialsqr.com/our-story",
    images: [
      {
        url: "https://memorialsqr.com/glenda-memorial-portrait.jpeg",
        width: 1200,
        height: 630,
        alt: "Glenda Kelso - The inspiration behind Memorial QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Story Behind Memorial QR - Built for Grandma Glenda",
    description: "A personal mission to ensure no family's stories are ever forgotten",
    images: ["https://memorialsqr.com/glenda-memorial-portrait.jpeg"],
  },
  alternates: {
    canonical: "https://memorialsqr.com/our-story",
  },
}

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-pink-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Built with Love for Grandma Glenda</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              The personal story behind Memorial QR and why we're passionate about preserving memories
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <Image
                  src="/glenda-memorial-portrait.jpeg"
                  alt="Glenda Kelso - The inspiration behind Memorial QR"
                  width={400}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Reason I Started This</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Hey, I'm <strong>Cole Collins</strong>.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  I built Memorial Star QR for my grandma, <strong>Glenda Kelso</strong>.
                </p>
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
                  <p className="text-gray-800 italic">
                    "My grandma was the best storyteller I've ever known. It was her superpower."
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                My grandma was the best storyteller I've ever known. It was her superpower. She didn't just tell
                stories; she made you feel like you were right there with her. Whether she was making everyone laugh at
                a family dinner or offering a piece of gentle wisdom, she knew the perfect story for every moment.
                That's how she showed her love.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                When she passed away, that's what I missed the most—the stories. The quiet was really hard. At her
                funeral, we all shared our favorite memories of her, and it was so comforting. But afterwards, I kept
                thinking,{" "}
                <em>
                  "What about next year? Or in ten years? What if someone wants to hear her story but doesn't know who
                  to ask?"
                </em>
              </p>

              <div className="bg-yellow-50 p-8 rounded-lg my-8 border-l-4 border-yellow-400">
                <p className="text-xl font-semibold text-gray-900 mb-4">
                  I couldn't stand the idea of her stories fading away.
                </p>
                <p className="text-gray-700">
                  So, I decided to build her a permanent home online. A place that would always be there, day or night,
                  for anyone who loved her. A place to hear her laugh, see her smile, and remember the incredible person
                  she was.
                </p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                You can see what I made for her here:{" "}
                <Link
                  href="/memorial/glenda-kelso"
                  className="text-purple-600 hover:text-purple-800 font-semibold underline"
                >
                  Glenda's Memorial Page
                </Link>
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We even put a QR code on her headstone. Now, when my family visits, we can scan it with our phones and
                immediately be surrounded by her memories. It's like she's right there with us, telling her stories all
                over again.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Creating this for her changed everything for me. It turned my grief into something meaningful. I
                realized that if this helped my family so much, it could help others, too.
              </p>

              <div className="bg-blue-50 p-8 rounded-lg my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">That's the real heart behind this business.</h3>
                <p className="text-lg text-gray-700 mb-4">
                  It's not about the tech or the QR codes—it's about making sure the people we love are never forgotten.
                  It's about honoring legacies, just like my grandma's.
                </p>
                <p className="text-lg text-gray-700">
                  I'm so proud to get to help other families keep their loved ones' stories alive.
                </p>
              </div>

              <div className="text-center my-12">
                <p className="text-lg text-gray-700 mb-2">Thanks for listening,</p>
                <p className="text-xl font-bold text-gray-900">Cole Collins</p>
                <p className="text-gray-600">Founder, Memorial Star QR & Glenda's Grandson</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              Everything we do is guided by the love and respect we have for the memories we help preserve
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Love & Compassion</h3>
                <p className="text-gray-600">
                  We understand the deep love behind every memorial and treat each story with the care it deserves.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-gray-600">
                  Every memorial we create is crafted with attention to detail and built to last forever.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Family First</h3>
                <p className="text-gray-600">
                  We're here to support families during difficult times and help them celebrate beautiful lives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Honor Your Loved One's Story</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Let us help you create a beautiful, lasting memorial that keeps their memory alive for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/pricing">
                Create a Memorial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              <Link href="/memorial/glenda-kelso">Visit Glenda's Memorial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-slate-400 text-sm">Honoring memories with digital memorials that last forever.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Memorial Packages
                  </Link>
                </li>
                <li>
                  <Link href="/qr-generator" className="hover:text-white">
                    QR Code Generator
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/our-story" className="hover:text-white">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
