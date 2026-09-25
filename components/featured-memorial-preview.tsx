import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink, Heart } from "lucide-react"

export function FeaturedMemorialPreview() {
  return (
    <section className="py-16 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See a Memorial in Action</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Experience how families are honoring their loved ones with interactive digital memorials
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card
            className="bg-zinc-800 border-zinc-700 overflow-hidden group"
          >
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-purple-900 to-slate-900 p-8 text-center">
                  <div>
                    <Heart className="mx-auto mb-5 size-14 text-purple-200" fill="currentColor" />
                    <p className="text-sm text-white/80">In Loving Memory</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">Glenda Jane Kelso</h3>
                    <p className="mt-2 text-sm text-white/70">July 27, 1952 – August 27, 2025</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-center">
                  <div className="space-y-4">
                    <p className="text-zinc-300">
                      This memorial showcases photos, life stories, and cherished memories shared by family and friends.
                      Scan the QR code or click to visit.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button asChild className="gap-2">
                        <Link href="/memorial/glenda-kelso">
                          <Play className="w-4 h-4" />
                          View Memorial
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="gap-2 border-zinc-600 bg-transparent">
                        <Link href="#product-selector">
                          <ExternalLink className="w-4 h-4" />
                          Create Your Own
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
