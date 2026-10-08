import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Music, ImageIcon, MessageCircle, Share2, Download, Smartphone } from "lucide-react"
import Link from "next/link"
import { pageMetadata, publicPages } from "@/lib/seo"

export const metadata = pageMetadata(publicPages.programs)

const features = [
  { icon: Heart, title: "Beautiful Memorial Page", description: "Personalized tribute with photos and memories" },
  { icon: Users, title: "Family Tree Display", description: "Visual representation of family connections" },
  { icon: Music, title: "Voicemails & Audio", description: "Add meaningful songs, voicemails, and audio memories" },
  { icon: ImageIcon, title: "Photo Gallery", description: "Unlimited photo uploads and organization" },
  { icon: MessageCircle, title: "Guest Messages", description: "Allow visitors to leave condolences and memories" },
  { icon: Share2, title: "Easy Sharing", description: "Share memorial link with family and friends" },
  { icon: Download, title: "QR Code Generation", description: "A QR code that opens the memorial page" },
  { icon: Smartphone, title: "Mobile Optimized", description: "Perfect viewing on all devices" },
]

export default function Programs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="relative bg-slate-900 text-white py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Digital Memorial Pages</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            A lasting page of photos, stories, and messages, opened by a QR keepsake. 10 years of hosting included.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6">
                <feature.icon className="h-6 w-6 text-slate-900 mb-3" />
                <h2 className="font-semibold mb-2">{feature.title}</h2>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Honor Your Loved One?</h2>
          <p className="text-xl text-slate-200 mb-6 max-w-2xl mx-auto">
            Choose a QR keepsake, then build the memorial page yourself or ask our team to build it. Every keepsake
            includes 10 years of hosting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
              <Link href="/store">Shop Keepsakes</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/concierge">Have Us Build It</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
