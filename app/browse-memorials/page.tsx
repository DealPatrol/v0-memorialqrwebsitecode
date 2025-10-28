"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List, Heart, Calendar, MapPin } from "lucide-react"

const memorials = [
  {
    id: "glenda-kelso",
    name: "Glenda Kelso",
    dates: "July 27, 1952 - August 27, 2025",
    location: "Cullman, AL",
    image: "/glenda-memorial-portrait.jpeg",
    description: "Beloved mother, grandmother, and friend who touched countless lives with her kindness and wisdom.",
    tags: ["Mother", "Grandmother", "Teacher"],
    featured: true,
  },
  {
    id: "robert-johnson",
    name: "Robert Johnson",
    dates: "March 15, 1945 - December 10, 2024",
    location: "Birmingham, AL",
    image: "/elderly-man-smiling-portrait.png",
    description: "Devoted father and veteran who served his country and community with honor.",
    tags: ["Father", "Veteran", "Community Leader"],
    featured: false,
  },
  {
    id: "maria-gonzalez",
    name: "Maria Gonzalez",
    dates: "June 8, 1960 - November 22, 2024",
    location: "Mobile, AL",
    image: "/hispanic-woman-smiling-professional-portrait.png",
    description: "Caring nurse and mother who dedicated her life to helping others heal.",
    tags: ["Mother", "Nurse", "Caregiver"],
    featured: false,
  },
  {
    id: "james-williams",
    name: "James Williams",
    dates: "September 12, 1938 - October 5, 2024",
    location: "Huntsville, AL",
    image: "/elderly-veteran-man-uniform-portrait.png",
    description: "Proud veteran and grandfather who shared his wisdom with three generations.",
    tags: ["Grandfather", "Veteran", "Mentor"],
    featured: false,
  },
  {
    id: "sarah-davis",
    name: "Dr. Sarah Davis",
    dates: "April 3, 1955 - September 18, 2024",
    location: "Montgomery, AL",
    image: "/professional-woman-doctor-white-coat-smiling.png",
    description: "Pioneering physician who broke barriers and saved countless lives.",
    tags: ["Doctor", "Pioneer", "Healer"],
    featured: false,
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    dates: "January 20, 1962 - August 14, 2024",
    location: "Tuscaloosa, AL",
    image: "/asian-man-engineer-smiling-professional-portrait.png",
    description: "Innovative engineer and loving father who built bridges both literal and metaphorical.",
    tags: ["Father", "Engineer", "Innovator"],
    featured: false,
  },
]

export default function BrowseMemorials() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterTag, setFilterTag] = useState("all")

  const allTags = ["all", ...Array.from(new Set(memorials.flatMap((m) => m.tags)))]

  const filteredMemorials = memorials
    .filter((memorial) => {
      const matchesSearch =
        memorial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memorial.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = filterTag === "all" || memorial.tags.includes(filterTag)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.dates.split(" - ")[1]).getTime() - new Date(a.dates.split(" - ")[1]).getTime()
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name)
      if (sortBy === "featured") return b.featured ? 1 : -1
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Memorials</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Honor the memories of loved ones and discover the stories that shaped their lives
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
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
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag === "all" ? "All Tags" : tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
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

        {/* Memorials Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemorials.map((memorial) => (
              <Card key={memorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={memorial.image || "/placeholder.svg"}
                    alt={memorial.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  {memorial.featured && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      <Heart className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{memorial.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{memorial.dates}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{memorial.location}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{memorial.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {memorial.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/memorial/${memorial.id}`}>View Memorial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMemorials.map((memorial) => (
              <Card key={memorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={memorial.image || "/placeholder.svg"}
                        alt={memorial.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      {memorial.featured && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500">
                          <Heart className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{memorial.name}</h3>
                        <Button asChild>
                          <Link href={`/memorial/${memorial.id}`}>View Memorial</Link>
                        </Button>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm mr-6">{memorial.dates}</span>
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{memorial.location}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{memorial.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {memorial.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredMemorials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No memorials found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilterTag("all")
              }}
              className="mt-4"
            >
              Clear Filters
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
