import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Smartphone, Heart, ArrowRight } from "lucide-react"
import { pageMetadata, publicPages, CONCIERGE_PRICE_LABEL } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.tombstones)

export default function MemorialQRCodesTombstonesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 border-white/30 bg-white/20 px-4 py-2 text-lg text-white backdrop-blur">
              Online memorial page
            </Badge>
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">QR Code Memorial Pages</h1>
            <p className="mb-4 text-2xl font-medium text-white/90">
              A digital memorial for a loved one, opened from a link or a QR code
            </p>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-white/80">
              MemorialsQR sells QR keepsakes that open the memorial website. Every keepsake includes 10 years of
              hosting. We do not sell headstone tags or garden stones.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white px-8 py-6 text-xl text-blue-600 hover:bg-gray-100">
                <Link href="/store">
                  Shop Keepsakes
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent px-8 py-6 text-xl text-white hover:bg-white hover:text-blue-600"
              >
                <Link href="/concierge">Concierge Memorial Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center text-4xl font-bold">What a QR code memorial is</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              A QR code memorial is a code that opens an online memorial page. The page holds photos, stories, and
              messages. Our keepsakes come with the code printed on them, or you can download a QR code and share
              the link yourself. MemorialsQR does not engrave or mount headstone markers.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Families sometimes use that code during a graveside visit. Every keepsake includes 10 years of hosting for its
              memorial page.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardHeader>
                <Smartphone className="mb-4 size-8 text-blue-600" />
                <CardTitle>QR memorial keepsake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <p>A printed keepsake whose QR code opens a memorial website of photos, stories, and messages.</p>
                <p className="font-semibold text-gray-900">10 years of hosting included</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <Heart className="mb-4 size-8 text-purple-600" />
                <CardTitle>Concierge memorial service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <p>We build the page for you. 10 years of hosting included.</p>
                <p className="font-semibold text-gray-900">{CONCIERGE_PRICE_LABEL}</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <Check className="mb-4 size-8 text-green-600" />
                <CardTitle>QR code you download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <p>Generate a code that opens the page. Print or share it yourself.</p>
                <Button asChild variant="link" className="h-auto p-0">
                  <Link href="/qr-generator">Open the QR generator</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">Start with a keepsake</h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-white/90">
            Every QR keepsake includes 10 years of memorial page hosting, with no recurring fees. The concierge memorial
            service is {CONCIERGE_PRICE_LABEL}.
          </p>
          <Button asChild size="lg" className="bg-white px-12 py-6 text-xl text-blue-600 hover:bg-gray-100">
            <Link href="/store">See Keepsakes</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
