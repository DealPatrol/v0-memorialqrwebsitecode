'use client'

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Heart, Award } from "lucide-react"

const caseStudies = [
  {
    id: 1,
    title: "Military Veteran Memorial",
    category: "Veteran Tribute",
    family: "The Henderson Family",
    story: "When retired Colonel James Henderson passed away, his family wanted to honor his 40+ years of military service. Through their Memorial QR code, they share his service photos, military commendations, and family stories. Over 2,000 visitors have scanned the QR code at his gravesite.",
    results: [
      "2,000+ scans from veterans and community members",
      "Service history preserved for future generations",
      "Family updated with 50+ new photos in first year",
    ],
    image: "/case-study-veteran.jpg",
    impact: "Thousands of people have learned about Colonel Henderson's service",
  },
  {
    id: 2,
    title: "Pet Legacy Project",
    category: "Pet Memorial",
    family: "The Martinez Sanctuary",
    story: "A rescue dog named Hope touched thousands of lives. Her family created a Memorial QR code at her resting place that catalogs her journey from rescue to beloved family member. The page now features 300+ photos, adoption stories she inspired, and testimonials from people she helped.",
    results: [
      "300+ photos and 50+ family testimonials",
      "Inspired 15+ similar pet memorials in their community",
      "Monthly visitors from people considering pet adoption",
    ],
    image: "/case-study-pet.jpg",
    impact: "Hope's memory continues inspiring adoption and rescue efforts",
  },
  {
    id: 3,
    title: "Multi-Generational Family Tree",
    category: "Family Legacy",
    family: "The Wong Lineage",
    story: "A family spanning five generations used Memorial QR codes to create an interactive family tree at the gravesite of the family matriarch. Relatives from around the world contribute family history, recipes, traditions, and stories. The memorial has become a cultural landmark.",
    results: [
      "120+ family members contributed content",
      "5+ family reunions organized around the memorial",
      "Cultural traditions documented and preserved",
    ],
    image: "/case-study-family.jpg",
    impact: "Multi-generational legacy preserved for descendants",
  },
]

export function CaseStudies() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real Impact: Case Studies
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            See how families and communities are using Memorial QR codes to preserve legacies and honor loved ones in meaningful ways.
          </p>
        </div>

        <div className="space-y-8">
          {caseStudies.map((study) => (
            <Card key={study.id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-amber-500/50 transition-colors">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full min-h-96">
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
                  <Image
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-3 bg-amber-600 text-white">{study.category}</Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">{study.title}</h3>
                  <p className="text-sm text-amber-500 font-semibold mb-4">— {study.family}</p>
                  
                  <p className="text-zinc-300 leading-relaxed mb-6">{study.story}</p>

                  {/* Impact Stats */}
                  <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Results & Impact
                    </h4>
                    <ul className="space-y-2">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex gap-2 text-zinc-300 text-sm">
                          <span className="text-amber-500 font-bold">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm text-amber-500 italic border-l-2 border-amber-500 pl-4">
                    "{study.impact}"
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">5,000+</p>
            <p className="text-zinc-400 text-sm">Families Trust Us</p>
          </div>
          <div className="text-center p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <Heart className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">50,000+</p>
            <p className="text-zinc-400 text-sm">Memorials Created</p>
          </div>
          <div className="text-center p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1M+</p>
            <p className="text-zinc-400 text-sm">QR Code Scans</p>
          </div>
          <div className="text-center p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">98%</p>
            <p className="text-zinc-400 text-sm">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
