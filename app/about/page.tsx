import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Award, Users, Heart, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Memorial QR | Our Mission & Team",
  description: "Learn about Memorial QR's mission to preserve legacies through digital memorials. Meet our team of experts committed to honoring memories.",
  openGraph: {
    title: "About Memorial QR",
    description: "Our mission to preserve legacies with digital memorials",
  },
}

export default function AboutPage() {
  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      bio: "Built Memorial QR after losing a family member and wanting a better way to preserve their story.",
      image: "/founder-alex.jpg",
    },
    {
      name: "Dr. Sarah Chen",
      role: "Chief Experience Officer",
      bio: "Grief counselor and memorial designer ensuring every memorial honors its subject meaningfully.",
      image: "/cxo-sarah.jpg",
    },
    {
      name: "James Thompson",
      role: "Director of Operations",
      bio: "20+ years in cemetery management, bringing industry expertise to product development.",
      image: "/ops-james.jpg",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Honor with Dignity",
      description: "Every memorial reflects the values and traditions that matter most to families.",
    },
    {
      icon: Lock,
      title: "Protect Privacy",
      description: "Advanced security ensures only authorized people can modify memorial content.",
    },
    {
      icon: Award,
      title: "Preserve Forever",
      description: "Lifetime hosting guarantees memorials remain accessible for future generations.",
    },
    {
      icon: Users,
      title: "Support Community",
      description: "Connect families through shared memories and collective mourning spaces.",
    },
  ]

  const credentials = [
    "30-Day Money-Back Guarantee",
    "SSL Encryption for All Data",
    "GDPR Compliant Privacy Policy",
    "PCI-DSS Payment Security",
    "Regular Security Audits",
    "Lifetime Content Preservation",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Memorial QR</h1>
          <p className="text-xl text-zinc-300 max-w-3xl">
            We're building a kinder way to remember. Memorial QR codes bridge the gap between traditional memorials and modern needs, allowing families to create lasting digital tributes that preserve stories, celebrate lives, and honor memories forever.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-black">Our Mission</h2>
          <div className="prose prose-lg max-w-none text-zinc-700 space-y-6">
            <p>
              When someone passes away, their digital footprint is lost. Photos disappear. Videos vanish. Stories fade. We created Memorial QR to ensure that the people we love—and the moments we cherish—are never forgotten.
            </p>
            <p>
              Our platform transforms headstones from static plaques into interactive digital memorials. A simple QR code opens a world of possibilities: unlimited photos, videos, life stories, military service records, and messages from loved ones. What used to fit on a few inches of granite can now encompass an entire life story.
            </p>
            <p>
              Memorial QR honors both tradition and innovation, respecting cemetery practices while embracing technology that helps families celebrate lives across time and distance.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <Card key={idx} className="border-zinc-200 hover:border-black transition-colors">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-black mb-4" />
                    <h3 className="font-semibold text-black mb-2">{value.title}</h3>
                    <p className="text-zinc-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-black">Meet Our Team</h2>
          <p className="text-lg text-zinc-600 text-center mb-12 max-w-3xl mx-auto">
            Our team brings together experts in grief counseling, memorial design, cemetery management, and digital preservation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <Card key={idx} className="border-zinc-200 overflow-hidden">
                <div className="relative h-64 bg-zinc-100">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-zinc-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Your Trust Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Bank-Level Security</h3>
              <p className="text-zinc-400">SSL encryption protects all data and transactions.</p>
            </div>
            <div className="text-center">
              <Lock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Privacy First</h3>
              <p className="text-zinc-400">Complete control over who sees your memorial content.</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Lifetime Promise</h3>
              <p className="text-zinc-400">We guarantee your memorials last as long as you do.</p>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-6">Our Security & Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map((cred, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-zinc-200">{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">Ready to Honor a Memory?</h2>
          <p className="text-lg text-zinc-600 mb-8">
            Create a meaningful digital memorial that will be cherished for generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/store" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-zinc-800 transition-colors">
              Shop Memorial Plaques
            </a>
            <a href="/contact" className="bg-zinc-200 text-black px-8 py-3 rounded-lg font-semibold hover:bg-zinc-300 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
