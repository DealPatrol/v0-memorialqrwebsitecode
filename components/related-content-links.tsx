import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, Camera, Heart } from "lucide-react"

const contentLinks = [
  {
    href: "/blog",
    icon: BookOpen,
    title: "Memorial Blog",
    description: "Tips for honoring loved ones",
  },
  {
    href: "/browse-memorials",
    icon: Users,
    title: "Browse Memorials",
    description: "See how others remember",
  },
  {
    href: "/how-it-works",
    icon: Camera,
    title: "How It Works",
    description: "Easy 3-step process",
  },
  {
    href: "/our-story",
    icon: Heart,
    title: "Our Story",
    description: "Why we started Memorial QR",
  },
]

export function RelatedContentLinks() {
  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Explore More</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contentLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all h-full group">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <link.icon className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-white mb-1">{link.title}</h3>
                  <p className="text-xs text-zinc-500 mb-2">{link.description}</p>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
