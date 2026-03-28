'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle2, Briefcase } from "lucide-react"

const experts = [
  {
    id: 1,
    name: "Dr. Elizabeth Morrison",
    title: "Licensed Clinical Grief Counselor",
    credentials: "PhD in Thanatology, LCSW",
    bio: "Dr. Morrison has over 15 years of experience helping families navigate grief and loss. She specializes in creating meaningful memorials as part of the healing process.",
    image: "/expert-counselor.jpg",
    specialties: ["Grief Counseling", "Memorial Psychology", "Family Support"],
    verified: true,
  },
  {
    id: 2,
    name: "James F. Kennedy",
    title: "Funeral Director & Cemetery Administrator",
    credentials: "Licensed Funeral Director, 20+ years",
    bio: "James has managed cemeteries across the US and recommends digital memorials as a modern way to honor loved ones while preserving grave integrity.",
    image: "/expert-funeral-director.jpg",
    specialties: ["Cemetery Management", "Burial Practices", "Memorial Traditions"],
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Sarah Chen",
    title: "Veterinary Behaviorist",
    credentials: "DVM, Certified Animal Behaviorist",
    bio: "Dr. Chen specializes in the human-animal bond and supports pet memorial practices that help owners process the loss of their beloved companions.",
    image: "/expert-veterinarian.jpg",
    specialties: ["Pet Loss", "Human-Animal Bond", "Memorial Practices"],
    verified: true,
  },
]

export function ExpertEndorsements() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Industry Experts
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Licensed professionals in grief counseling, funeral services, and veterinary medicine recommend Memorial QR codes as a thoughtful way to honor loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {experts.map((expert) => (
            <Card key={expert.id} className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-colors">
              <CardContent className="p-6">
                {/* Expert Image */}
                <div className="relative h-40 w-40 mx-auto mb-6 rounded-lg overflow-hidden border-2 border-amber-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20" />
                  <Image
                    src={expert.image || "/placeholder.svg"}
                    alt={expert.name}
                    fill
                    className="object-cover"
                  />
                  {expert.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-white text-center mb-1">{expert.name}</h3>
                <p className="text-amber-500 text-center text-sm font-semibold mb-1">{expert.title}</p>
                <p className="text-zinc-500 text-center text-xs mb-4">{expert.credentials}</p>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4 text-center">{expert.bio}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {expert.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="bg-zinc-800 text-zinc-200 text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Endorsement Quote Section */}
        <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-8 text-center">
          <Award className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-lg text-white mb-2">
            "Memorial QR codes represent a meaningful intersection of traditional memorial practices and modern technology. They preserve dignity while enabling families to share their loved one's story in a way that honors their memory."
          </p>
          <p className="text-sm text-zinc-400">— Dr. Elizabeth Morrison, Licensed Clinical Grief Counselor</p>
        </div>
      </div>
    </section>
  )
}
