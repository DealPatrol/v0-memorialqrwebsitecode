"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Grid, List, Calendar, MapPin, User, PawPrint } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"

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
  memorial_type?: "human" | "pet"
}

function BrowseMemorialsContent() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") || "all"

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [memorialType, setMemorialType] = useState<"all" | "human" | "pet">(initialType as "all" | "human" | "pet")
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

      const matchesType = memorialType === "all" || memorial.memorial_type === memorialType || !memorial.memorial_type

      return matchesSearch && matchesType
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
      <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Memorials</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Explore beautiful digital tributes created by our community for loved ones and beloved pets
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {/* Memorial Type Tabs */}
          <div className="mb-6">
            <Tabs value={memorialType} onValueChange={(value) => setMemorialType(value as "all" | "human" | "pet")}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="all">All Memorials</TabsTrigger>
                <TabsTrigger value="human" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Human
                </TabsTrigger>
                <TabsTrigger value="pet" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  <PawPrint className="w-4 h-4 mr-2" />
                  Pet
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

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
                  {memorial.memorial_type && (
                    <div className="absolute top-2 right-2">
                      {memorial.memorial_type === "pet" ? (
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <PawPrint className="w-3 h-3" />
                          Pet
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Human
                        </span>
                      )}
                    </div>
                  )}
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
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{memorial.full_name}</h3>
                          {memorial.memorial_type && (
                            <>
                              {memorial.memorial_type === "pet" ? (
                                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <PawPrint className="w-3 h-3" />
                                  Pet
                                </span>
                              ) : (
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  Human
                                </span>
                              )}
                            </>
                          )}
                        </div>
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
                ? "No memorials available yet. Be the first to create one!"
                : "No memorials found matching your criteria."}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setMemorialType("all")
              }}
              className="mt-4"
            >
              {memorials.length === 0 ? "Create Memorial" : "Clear Filters"}
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Create a Memorial</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Honor your loved ones or beloved pets with a beautiful digital memorial that can be shared with family and
            friends
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/human-memorials">
                <User className="w-5 h-5 mr-2" />
                Human Memorial
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/pet-memorials">
                <PawPrint className="w-5 h-5 mr-2" />
                Pet Memorial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrowseMemorials() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-gray-600">Loading memorials...</p>
          </div>
        </div>
      }
    >
      <BrowseMemorialsContent />
    </Suspense>
  )
}
