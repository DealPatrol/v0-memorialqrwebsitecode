"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const blogPosts = [
  {
    slug: "complete-guide-to-memorial-qr-codes",
    title: "The Complete Guide to Memorial QR Codes: Honoring Loved Ones in the Digital Age",
    excerpt:
      "Discover how QR code memorials are revolutionizing the way we remember and honor those we've lost. Learn everything about creating lasting digital tributes.",
    category: "Guides",
    author: "Sarah Mitchell",
    date: "2024-12-15",
    readTime: "8 min read",
    image: "/images/92623621-9554-4f8b-a5be.jpeg",
    featured: true,
  },
  {
    slug: "pet-memorial-ideas-honoring-furry-friends",
    title: "25 Beautiful Pet Memorial Ideas to Honor Your Furry Friend",
    excerpt:
      "Losing a pet is heartbreaking. Explore creative and touching ways to memorialize your beloved companion and keep their memory alive forever.",
    category: "Pet Memorials",
    author: "Dr. Emily Rogers",
    date: "2024-12-10",
    readTime: "10 min read",
    image: "/images/41730040-9590-452b-80df.jpeg",
    featured: true,
  },
  {
    slug: "how-to-create-meaningful-digital-memorial",
    title: "How to Create a Meaningful Digital Memorial: Step-by-Step Guide",
    excerpt:
      "Creating a digital memorial doesn't have to be overwhelming. Follow our comprehensive guide to build a beautiful tribute that honors your loved one's legacy.",
    category: "Guides",
    author: "Michael Chen",
    date: "2024-12-05",
    readTime: "12 min read",
    image: "/images/7dc9e3be-9214-4273-b976.jpeg",
  },
  {
    slug: "grief-support-coping-with-loss",
    title: "Coping with Loss: A Guide to Grief Support and Healing",
    excerpt:
      "Grieving is a personal journey. Find helpful resources, coping strategies, and support for navigating the difficult path of losing someone you love.",
    category: "Grief Support",
    author: "Dr. Jennifer Walsh",
    date: "2024-12-01",
    readTime: "7 min read",
    image: "/images/5a066d02-9fa2-4039-8ac7.jpeg",
  },
  {
    slug: "memorial-headstone-plaques-buying-guide",
    title: "Memorial Headstone Plaques: Everything You Need to Know Before You Buy",
    excerpt:
      "Choosing a memorial plaque is an important decision. Learn about materials, customization options, installation, and how to select the perfect tribute.",
    category: "Product Guides",
    author: "Robert Thompson",
    date: "2024-11-28",
    readTime: "9 min read",
    image: "/images/1e1eb652-cd3d-4fa5-86c5.jpeg",
  },
  {
    slug: "personalized-memorial-gifts-ideas",
    title: "20 Personalized Memorial Gifts That Bring Comfort and Remembrance",
    excerpt:
      "Looking for a thoughtful memorial gift? Discover meaningful, personalized options that help keep cherished memories alive and provide comfort during difficult times.",
    category: "Gift Ideas",
    author: "Lisa Anderson",
    date: "2024-11-25",
    readTime: "6 min read",
    image: "/images/30a0c26e-3bab-4662-9598.jpeg",
  },
  {
    slug: "qr-code-technology-memorials",
    title: "How QR Code Technology is Transforming Memorial Services",
    excerpt:
      "QR codes are bridging the physical and digital worlds in memorial services. Explore the innovative technology making memorials more accessible and interactive.",
    category: "Technology",
    author: "David Martinez",
    date: "2024-11-20",
    readTime: "8 min read",
    image: "/images/adc4c31b-2080-4d10-809a.jpeg",
  },
  {
    slug: "veteran-memorial-ideas",
    title: "Honoring Veterans: Memorial Ideas for Military Service Members",
    excerpt:
      "Veterans deserve special recognition. Discover meaningful ways to honor military service members with patriotic memorial tributes and digital memorials.",
    category: "Special Tributes",
    author: "Colonel James Wilson (Ret.)",
    date: "2024-11-15",
    readTime: "10 min read",
    image: "/images/1e1eb652-cd3d-4fa5-86c5.jpeg",
  },
  {
    slug: "preserving-family-history-digital-memorials",
    title: "Preserving Family History Through Digital Memorials",
    excerpt:
      "Digital memorials are more than tributes—they're family archives. Learn how to preserve stories, photos, and memories for future generations.",
    category: "Family Legacy",
    author: "Margaret Sullivan",
    date: "2024-11-10",
    readTime: "11 min read",
    image: "/images/7dc9e3be-9214-4273-b976.jpeg",
  },
]

const categories = [
  "All Posts",
  "Guides",
  "Pet Memorials",
  "Grief Support",
  "Product Guides",
  "Gift Ideas",
  "Technology",
  "Special Tributes",
  "Family Legacy",
]

export function BlogContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Posts")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Memorial QR Blog</h1>
            <p className="text-xl text-white/90 mb-8">
              Helpful guides, memorial ideas, and grief support resources to honor your loved ones
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap ${selectedCategory === cat ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "All Posts" && !searchQuery && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.slug} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative bg-slate-200">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Featured</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-2xl leading-tight hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>By {post.author}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" className="px-0">
                      <Link href={`/blog/${post.slug}`}>
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory === "All Posts"
                ? "Latest Articles"
                : selectedCategory}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No articles found.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All Posts")
                }}
              >
                View All Articles
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.slug} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative bg-slate-200">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                    {post.featured && (
                      <Badge className="absolute top-3 right-3 bg-orange-500 text-white">Featured</Badge>
                    )}
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <Button asChild variant="link" className="px-0 h-auto">
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Memorial Resources & Tips</h2>
            <p className="text-xl text-white/90 mb-8">
              Subscribe to receive helpful guides, memorial ideas, and grief support resources delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Enter your email" className="bg-white flex-1" />
              <Button size="lg" variant="secondary">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </>
  )
}
