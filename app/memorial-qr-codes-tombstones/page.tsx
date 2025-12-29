import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Shield, Smartphone, Heart, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Memorial QR Codes for Tombstones & Headstones | Digital Gravestone Tributes",
  description:
    "Premium memorial QR codes for tombstones, headstones, and gravestones. Transform cemetery memorials into interactive digital tributes with QR code plaques. Weather-resistant, lifetime hosting, free shipping.",
  keywords:
    "memorial QR codes for tombstones, QR code for headstone, gravestone QR code, cemetery memorial QR, tombstone QR plaque, headstone memorial tag, QR code cemetery marker, digital gravestone memorial, interactive tombstone, memorial QR tag",
  openGraph: {
    title: "Memorial QR Codes for Tombstones & Headstones | Digital Cemetery Memorials",
    description:
      "Transform traditional tombstone memorials with QR codes. Visitors scan the gravestone QR tag to access photos, videos, and life stories. Weather-resistant plaques with lifetime hosting.",
    images: ["/images/41730040-9590-452b-80df.jpeg"],
  },
}

export default function MemorialQRCodesTombstonesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur text-white px-4 py-2 text-lg border-white/30">
              #1 Memorial QR Solution
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Memorial QR Codes for Tombstones & Headstones
            </h1>
            <p className="text-2xl mb-4 text-white/90 font-medium">
              Transform Your Loved One's Gravestone into an Interactive Digital Memorial
            </p>
            <p className="text-xl mb-8 text-white/80 max-w-3xl mx-auto">
              Premium weather-resistant QR code plaques for cemetery headstones, gravestones, and memorial markers.
              Visitors scan the QR tag to access unlimited photos, videos, obituaries, and life stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-xl">
                <Link href="/store">
                  Shop Memorial QR Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-xl bg-transparent"
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Lifetime Hosting</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Weather-Resistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Memorial QR Codes Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">What Are Memorial QR Codes for Tombstones?</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <Image
                  src="/images/41730040-9590-452b-80df.jpeg"
                  alt="Memorial QR codes for tombstones and headstones"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  A <strong>memorial QR code for tombstones</strong> is a permanent, weather-resistant plaque or tag
                  that attaches to a headstone, gravestone, or cemetery marker. When visitors scan the QR code with
                  their smartphone, they're instantly connected to a comprehensive digital memorial website.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Unlike traditional tombstone engravings limited by space, a <strong>gravestone QR code</strong>{" "}
                  provides unlimited digital space to share photos, videos, life stories, obituaries, and cherished
                  memories. It transforms cemetery visits into rich, meaningful experiences.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="text-blue-900 font-medium">
                    Over 10,000 families have chosen our memorial QR codes to honor their loved ones with lasting
                    digital tributes on tombstones and headstones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Why Choose Memorial QR Codes for Your Headstone?</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Transform traditional cemetery memorials into interactive tributes that preserve your loved one's legacy
              for generations
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Unlimited Digital Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Traditional tombstone engravings are limited. Our memorial QR codes provide unlimited space for
                    photos, videos, stories, and obituaries. Share their complete life story, not just dates.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Weather-Resistant & Permanent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our headstone QR code plaques are laser-engraved on premium materials designed for cemetery use.
                    Withstands rain, snow, UV rays, and extreme temperatures for decades.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Easy for All Ages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Simply point a smartphone camera at the tombstone QR code and tap. No app downloads needed. Works on
                    all modern smartphones. Even great-grandparents can access the memorial.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Update Anytime</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Add new photos, stories, and memories to the digital memorial anytime. The gravestone QR code stays
                    the same, but the content grows as families share more memories over time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Guest Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Cemetery visitors can leave condolences, share their own memories, and connect with family. Creates
                    a living tribute that brings comfort to grieving families.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Lifetime Guarantee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Your memorial website is hosted forever. No monthly fees, no hidden costs. Your tombstone QR code
                    will work for generations, preserving your loved one's legacy permanently.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">How Memorial QR Codes for Tombstones Work</h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Simple 3-step process to create your loved one's digital gravestone memorial
            </p>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Choose Your Memorial QR Product</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Select from premium stainless steel, gold, or black headstone tags designed specifically for
                    cemetery use. All QR code plaques are weather-resistant and laser-engraved for permanent durability
                    on tombstones.
                  </p>
                  <Image
                    src="/images/adc4c31b-2080-4d10-809a.jpeg"
                    alt="Memorial QR code tags for tombstones in multiple finishes"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Create the Digital Memorial</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Build a beautiful memorial website with photos, videos, obituary, life story, and cherished
                    memories. Add unlimited content that brings your loved one's life story to life beyond what a
                    traditional gravestone allows.
                  </p>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Unlimited photos & videos</strong> - Share their life in pictures
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Complete life story</strong> - Tell their story beyond tombstone dates
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Family memories</strong> - Collaborate with relatives to build the tribute
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Guest condolences</strong> - Cemetery visitors can leave messages
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Attach to Headstone & Share</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Receive your custom QR code plaque with mounting hardware. Attach to the tombstone, gravestone, or
                    cemetery marker. Visitors scan the QR tag to instantly access the full digital memorial tribute.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <p className="text-blue-900 font-medium text-lg">
                      Ships within 3-5 business days with free shipping. Includes detailed installation instructions and
                      all mounting hardware for easy headstone attachment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 px-12 py-6 text-xl">
                <Link href="/store">Get Started - Shop Memorial QR Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Premium Memorial QR Code Products for Tombstones</h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Weather-resistant headstone tags and cemetery memorial plaques
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
                <div className="relative h-64">
                  <Image
                    src="/images/adc4c31b-2080-4d10-809a.jpeg"
                    alt="Stainless steel memorial QR code for tombstone"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Stainless Steel Headstone Tag</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Premium memorial QR code for tombstones. Weather-resistant stainless steel with laser-engraved QR
                    code.
                  </p>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    $19.99 <span className="text-sm text-gray-500">+ $4.99/mo hosting</span>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/store">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
                <div className="relative h-64">
                  <Image
                    src="/images/1e1eb652-cd3d-4fa5-86c5.jpeg"
                    alt="Memorial garden stone with QR code for cemetery"
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-orange-500 text-white">Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Garden Memorial Stone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Large memorial stone with QR plaque. Perfect for cemetery plots, gardens, or memorial spaces.
                  </p>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    $59.99 <span className="text-sm text-gray-500">+ $4.99/mo hosting</span>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/store">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
                <div className="relative h-64">
                  <Image
                    src="/images/5a066d02-9fa2-4039-8ac7.jpeg"
                    alt="Memorial slate coaster with QR code"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Memorial Slate Coaster</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Elegant engraved slate with QR code. Perfect keepsake for home memorials and remembrance gifts.
                  </p>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    $16.99 <span className="text-sm text-gray-500">+ $4.99/mo hosting</span>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/store">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                <Link href="/store">View All Memorial QR Products →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold mb-6">
              Complete Guide to Memorial QR Codes for Tombstones and Headstones
            </h2>

            <h3 className="text-2xl font-bold mt-8 mb-4">What Makes Our Tombstone QR Codes Different?</h3>
            <p className="text-gray-700 leading-relaxed">
              Not all memorial QR codes for tombstones are created equal. Our premium <strong>headstone QR tags</strong>{" "}
              are specifically engineered for cemetery use with weather-resistant materials, UV-protective coatings, and
              professional laser engraving. Unlike cheap alternatives, our <strong>gravestone QR code plaques</strong>{" "}
              are guaranteed to remain scannable for decades, even when exposed to harsh weather conditions at cemetery
              sites.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Cemetery Approved Memorial QR Solutions</h3>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>memorial QR codes for tombstones</strong> comply with cemetery regulations and memorial park
              guidelines. The discreet design and professional appearance ensure your <strong>headstone QR tag</strong>{" "}
              integrates seamlessly with traditional cemetery markers. We've worked with over 500 cemeteries nationwide
              to provide approved <strong>gravestone QR code</strong> solutions that preserve the dignity of memorial
              spaces while offering modern digital tributes.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Digital Memorial Features for Tombstone QR Codes</h3>
            <p className="text-gray-700 leading-relaxed">
              When visitors scan your <strong>tombstone QR code</strong>, they access a comprehensive digital memorial
              featuring:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Unlimited photo galleries showing your loved one's life journey</li>
              <li>• Video tributes and recorded memories from family members</li>
              <li>• Complete obituary and life story beyond gravestone limitations</li>
              <li>• Interactive timeline of major life events and achievements</li>
              <li>• Guest book for cemetery visitors to leave condolences</li>
              <li>• Family tree and genealogy information</li>
              <li>• Memorial donation links and charity information</li>
              <li>• GPS location to help visitors find the gravesite</li>
            </ul>

            <h3 className="text-2xl font-bold mt-8 mb-4">Installation and Cemetery Use</h3>
            <p className="text-gray-700 leading-relaxed">
              Installing your <strong>memorial QR code on a tombstone</strong> is simple. Each{" "}
              <strong>headstone QR tag</strong> includes multiple mounting options: industrial-strength adhesive for
              permanent attachment, screw holes for bolt-mounting, or magnetic backing for temporary placement. Detailed
              instructions ensure proper installation on granite headstones, marble gravestones, bronze plaques, and
              other cemetery markers. Most families complete installation in under 10 minutes.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Why Families Choose Memorial QR Codes</h3>
            <p className="text-gray-700 leading-relaxed">
              Traditional tombstone engravings are beautiful but limited. A{" "}
              <strong>memorial QR code for headstones</strong> enhances cemetery visits by transforming a simple
              gravestone into an interactive tribute. Younger generations especially appreciate{" "}
              <strong>digital gravestone memorials</strong> that allow them to share photos, videos, and stories that
              keep memories alive. Our <strong>tombstone QR code plaques</strong> bridge the gap between traditional
              cemetery memorials and modern digital remembrance.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded my-8">
              <h4 className="text-xl font-bold text-blue-900 mb-3">Ready to Honor Your Loved One?</h4>
              <p className="text-blue-900 mb-4">
                Join over 10,000 families who have chosen memorial QR codes for their loved ones' tombstones. Create a
                lasting digital tribute that preserves their memory for generations.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/store">Shop Memorial QR Products Now</Link>
              </Button>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>

            <h4 className="text-lg font-bold mt-6 mb-2">How long do memorial QR codes for tombstones last?</h4>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>headstone QR tags</strong> are laser-engraved on weather-resistant materials with a minimum
              5-year durability guarantee. Most customers report their <strong>tombstone QR codes</strong> remain
              perfectly scannable for 10+ years. The digital memorial website is hosted for life with no expiration.
            </p>

            <h4 className="text-lg font-bold mt-6 mb-2">Will the QR code work in all weather conditions?</h4>
            <p className="text-gray-700 leading-relaxed">
              Yes. Our <strong>cemetery QR code plaques</strong> are specifically designed for outdoor gravestone use.
              They withstand rain, snow, ice, extreme heat, and direct sunlight. The laser engraving won't fade, and the
              protective coating prevents weather damage.
            </p>

            <h4 className="text-lg font-bold mt-6 mb-2">Do cemeteries allow QR codes on tombstones?</h4>
            <p className="text-gray-700 leading-relaxed">
              Most modern cemeteries permit <strong>memorial QR code tags on headstones</strong>. Our discreet,
              professional designs comply with cemetery regulations. We recommend checking with your specific cemetery
              or memorial park, but the vast majority approve our products.
            </p>

            <h4 className="text-lg font-bold mt-6 mb-2">Can I update the memorial content after installation?</h4>
            <p className="text-gray-700 leading-relaxed">
              The <strong>gravestone QR code</strong> stays the same permanently, but you can update the digital
              memorial content anytime. Add new photos, videos, and stories as often as you like. The QR code always
              links to the latest version.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Create a Lasting Tribute on Their Tombstone</h2>
          <p className="text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Transform your loved one's gravestone into an interactive memorial. Preserve their legacy with a
            weather-resistant QR code that tells their complete life story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl">
              <Link href="/store">Shop Memorial QR Products</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-xl bg-transparent"
            >
              <Link href="/contact">Speak with a Specialist</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-lg">
            <div className="flex items-center gap-2">
              <Check className="w-6 h-6" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-6 h-6" />
              <span>Lifetime Hosting</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-6 h-6" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
