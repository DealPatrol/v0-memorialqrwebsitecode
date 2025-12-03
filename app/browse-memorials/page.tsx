"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Calendar, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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

export default function BrowseMemorials() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemorials = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("memorials").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching memorials:", error)
        } else {
          setMemorials(data || [])
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemorials()
  }, [])

  const filteredMemorials = memorials
    .filter((memorial) => {
      const matchesSearch =
        memorial.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (memorial.location && memorial.location.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === "alphabetical") return a.full_name.localeCompare(b.full_name)
      return 0
    })

  const formatDates = (birthDate: string | null, deathDate: string | null) => {
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "Unknown"
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    }
    return `${formatDate(birthDate)} - ${formatDate(deathDate)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading memorials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sample Memorials</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Explore beautiful digital memorials created by our community
          </p>
        </div>
      </div>

      {/* Featured PUNDE Memorial Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Featured Memorial</h2>
          <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <div className="relative">
              <Image
                src="/catholic-church-notre-dame-kinshasa-congo-universi.jpg"
                alt="Paroisse Universitaire Notre Dame de l'Espérance"
                width={1200}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Featured Parish Memorial
              </div>
            </div>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-3 text-slate-900">
                    Paroisse Universitaire Notre Dame de l'Espérance (PUNDE)
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="text-base">Fondée le 8 décembre 1968</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-base">Campus de l'Université de Kinshasa, Lemba, RD Congo</span>
                  </div>
                  <p className="text-gray-700 text-base mb-6 leading-relaxed">
                    La Paroisse Universitaire Notre Dame de l'Espérance a été créée par le Cardinal Joseph-Albert Malula
                    pour accompagner spirituellement la communauté universitaire de Kinshasa. Découvrez plus de 55 ans
                    d'histoire, les biographies de six prêtres remarquables, et le patrimoine spirituel de cette
                    paroisse exceptionnelle.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/punde">Découvrir l'Histoire Complète</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/punde#biographies">Biographies des Prêtres</Link>
                    </Button>
                  </div>
                </div>
                <div className="md:w-64 bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-slate-900">Sections Disponibles</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">📰</span>
                      <span>Actualités (mises à jour hebdomadaires)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">📖</span>
                      <span>Histoire depuis 1968</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">👥</span>
                      <span>Biographies de 6 curés</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2">🎥</span>
                      <span>Guide vidéo et ressources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-slate-900">Other Memorials</h2>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMemorials.length} memorial{filteredMemorials.length !== 1 ? "s" : ""}
          </p>
        </div>

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemorials.map((memorial) => (
              <Card key={memorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={memorial.profile_image_url || "/placeholder.svg?height=300&width=400"}
                    alt={memorial.full_name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{memorial.full_name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDates(memorial.birth_date, memorial.death_date)}</span>
                  </div>
                  {memorial.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{memorial.location}</span>
                    </div>
                  )}
                  {memorial.biography && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{memorial.biography}</p>
                  )}
                  <Button asChild className="w-full">
                    <Link href={`/memorial/${memorial.slug || memorial.id}`}>View Memorial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-4">
            {filteredMemorials.map((memorial) => (
              <Card key={memorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={memorial.profile_image_url || "/placeholder.svg?height=120&width=120"}
                        alt={memorial.full_name}
                        width={120}
                        height={120}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{memorial.full_name}</h3>
                        <Button asChild>
                          <Link href={`/memorial/${memorial.slug || memorial.id}`}>View Memorial</Link>
                        </Button>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm mr-6">{formatDates(memorial.birth_date, memorial.death_date)}</span>
                        {memorial.location && (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{memorial.location}</span>
                          </>
                        )}
                      </div>
                      {memorial.biography && <p className="text-gray-700 text-sm mb-3">{memorial.biography}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredMemorials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {memorials.length === 0
                ? "No public memorials available yet. Be the first to create one!"
                : "No memorials found matching your criteria."}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
              }}
              className="mt-4"
            >
              {memorials.length === 0 ? "Create Memorial" : "Clear Filters"}
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Create a Memorial</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Honor your loved one with a beautiful digital memorial that can be shared with family and friends
          </p>
          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
            <Link href="/pricing">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
