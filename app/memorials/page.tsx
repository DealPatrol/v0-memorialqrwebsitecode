import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { MemorialCard } from "@/components/memorial-card"

export const metadata: Metadata = {
  title: "Memorial Examples | Memorial QR",
  description:
    "Browse our collection of memorial examples to see how Memorial QR can help preserve memories of your loved ones.",
}

// Sample memorial data
const sampleMemorials = [
  {
    id: "sample-1",
    name: "Robert James Anderson",
    birth_date: "1945-03-12",
    death_date: "2022-08-24",
    bio: "Robert was a beloved father, grandfather, and veteran who served his country with honor. His passion for woodworking and storytelling brought joy to everyone who knew him.",
    cover_image_url: "/images/memorial-1.jpg",
  },
  {
    id: "sample-2",
    name: "Elizabeth Marie Thompson",
    birth_date: "1938-11-05",
    death_date: "2023-01-17",
    bio: "Elizabeth was a dedicated teacher for over 40 years. Her love for literature and music inspired generations of students. She leaves behind a legacy of compassion and wisdom.",
    cover_image_url: "/images/memorial-2.jpg",
  },
  {
    id: "sample-3",
    name: "Michael David Wilson",
    birth_date: "1952-07-22",
    death_date: "2021-12-03",
    bio: "Michael was known for his infectious laugh and entrepreneurial spirit. As a community leader and business owner, he helped countless people achieve their dreams.",
    cover_image_url: "/images/memorial-3.jpg",
  },
  {
    id: "sample-4",
    name: "Sarah Jennifer Collins",
    birth_date: "1970-04-18",
    death_date: "2023-05-29",
    bio: "Sarah was an accomplished artist and environmental advocate. Her paintings captured the beauty of nature she fought so hard to protect. Her spirit lives on through her artwork and the causes she championed.",
    cover_image_url: "/placeholder.svg?height=400&width=600&text=Sarah+Collins",
  },
  {
    id: "sample-5",
    name: "Thomas Edward Miller",
    birth_date: "1928-09-30",
    death_date: "2020-11-11",
    bio: "Thomas was a World War II veteran who later became a respected doctor in his community. His dedication to helping others and his stories of resilience continue to inspire his family and friends.",
    cover_image_url: "/placeholder.svg?height=400&width=600&text=Thomas+Miller",
  },
  {
    id: "sample-6",
    name: "Grace Patricia Lee",
    birth_date: "1965-12-25",
    death_date: "2022-03-08",
    bio: "Grace was a talented chef and loving mother. Her kitchen was the heart of her home, where she created not just meals but memories. Her recipes and wisdom continue to nourish those she left behind.",
    cover_image_url: "/placeholder.svg?height=400&width=600&text=Grace+Lee",
  },
]

export default function MemorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Memorial Examples</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our collection of memorial examples to see how Memorial QR can help preserve and share the memories
            of your loved ones for generations to come.
          </p>
        </div>

        {/* Featured Memorial */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image src="/images/memorial-1.jpg" alt="Featured Memorial" fill className="object-cover" priority />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Featured Memorial</div>
              <h2 className="mt-2 text-2xl font-serif leading-tight">Robert James Anderson</h2>
              <p className="text-gray-500">1945 - 2022</p>
              <p className="mt-4 text-gray-600">
                Robert was a beloved father, grandfather, and veteran who served his country with honor. His passion for
                woodworking and storytelling brought joy to everyone who knew him.
              </p>
              <div className="mt-6">
                <h3 className="font-medium text-gray-900">Memorial Features:</h3>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>• Photo gallery with 45+ memories</li>
                  <li>• 12 video tributes from family and friends</li>
                  <li>• Interactive family tree with 3 generations</li>
                  <li>• Timeline of life achievements</li>
                </ul>
              </div>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/memorial/sample-1">View This Memorial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Memorial Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleMemorials.map((memorial) => (
            <MemorialCard key={memorial.id} memorial={memorial} />
          ))}
        </div>

        {/* Create Your Own CTA */}
        <div className="mt-16 text-center bg-gray-800 text-white rounded-xl p-8">
          <h2 className="text-3xl font-serif mb-4">Create Your Own Memorial</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Honor your loved one with a beautiful digital memorial that can be accessed through a durable QR code. Share
            photos, videos, stories, and more.
          </p>
          <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500" asChild>
            <Link href="/checkout">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
