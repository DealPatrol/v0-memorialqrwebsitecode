"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react"

type Memorial = {
  id: string
  full_name: string
  birth_date: string | null
  death_date: string | null
  location: string | null
  biography: string | null
  profile_image_url: string | null
  slug: string
  created_at: string
}

export function BrowseMemorialsClient({ memorials }: { memorials: Memorial[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMemorials = memorials.filter((memorial) =>
    memorial.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">Browse Memorial Examples</h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground">
            Explore beautiful digital memorials created with Memorial QR. See how families honor their loved ones with
            photos, stories, and memories.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Memorials Grid */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {filteredMemorials.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
              <Search className="mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No memorials found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "No memorials have been created yet"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMemorials.map((memorial) => (
                <Card key={memorial.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {memorial.profile_image_url ? (
                      <img
                        src={memorial.profile_image_url || "/placeholder.svg"}
                        alt={memorial.full_name}
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <span className="text-6xl font-bold text-muted-foreground/20">
                          {memorial.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-semibold">{memorial.full_name}</h3>

                    {(memorial.birth_date || memorial.death_date) && (
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>
                          {memorial.birth_date && new Date(memorial.birth_date).getFullYear()}
                          {memorial.birth_date && memorial.death_date && " - "}
                          {memorial.death_date && new Date(memorial.death_date).getFullYear()}
                        </span>
                      </div>
                    )}

                    {memorial.location && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        <span>{memorial.location}</span>
                      </div>
                    )}

                    {memorial.biography && (
                      <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{memorial.biography}</p>
                    )}

                    <Button asChild className="w-full">
                      <Link href={`/memorial/${memorial.slug}`}>
                        View Memorial
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Create Your Own Memorial</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Honor your loved one with a beautiful digital memorial page and QR code plaque
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/products/memorial-qr-plaque">View Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/create-memorial">Create Memorial</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
