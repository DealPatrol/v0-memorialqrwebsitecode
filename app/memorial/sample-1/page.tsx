import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRImage } from "@/components/qr-image"
import { format } from "date-fns"
import { MessageCircle, Share2, Calendar, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Robert James Anderson | Memorial QR",
  description:
    "In loving memory of Robert James Anderson (1945-2022). Browse photos, videos, and stories celebrating his life.",
}

// Sample memorial data
const memorial = {
  id: "sample-1",
  name: "Robert James Anderson",
  birth_date: "1945-03-12",
  death_date: "2022-08-24",
  bio: "Robert James Anderson was born on March 12, 1945, in Portland, Oregon. He was the second of four children born to James and Mary Anderson.\n\nAfter graduating high school in 1963, Robert joined the United States Army where he served with distinction for 8 years, including a tour in Vietnam. Upon returning home, he used his GI Bill to attend college, earning a degree in Engineering from Oregon State University.\n\nRobert worked for Pacific Northwest Engineering for over 30 years, where he was known for his problem-solving abilities and mentorship of younger engineers. In his spare time, he was an avid woodworker, creating beautiful furniture pieces that are still cherished by his family.\n\nHe married the love of his life, Margaret, in 1970, and together they raised three children: James, Sarah, and Michael. Robert was a devoted grandfather to his seven grandchildren, always ready with a story or a new wooden toy he had crafted.\n\nRobert was known for his infectious laugh, his unwavering integrity, and his willingness to help anyone in need. He was active in his local veterans' organization and volunteered regularly at the community woodshop, teaching classes to at-risk youth.\n\nHe passed peacefully on August 24, 2022, surrounded by his loving family. His legacy lives on through the many lives he touched and the values he instilled in his children and grandchildren.",
  cover_image_url: "/images/robert-cover.jpg",
}

// Sample stories/tributes
const stories = [
  {
    id: "1",
    author_name: "Margaret Anderson",
    content:
      "My beloved husband of 52 years. Not a day goes by that I don't think of your smile and the warmth you brought into our lives. You were my rock, my best friend, and the love of my life. Until we meet again.",
    created_at: "2022-09-01T14:23:00Z",
  },
  {
    id: "2",
    author_name: "James Anderson",
    content:
      "Dad, you taught me what it means to be a man of integrity and compassion. I still use the toolbox you made for me when I was 10, and I think of you every time. Your grandchildren miss their 'Papa' and his stories. We're keeping your memory alive.",
    created_at: "2022-09-03T10:15:00Z",
  },
  {
    id: "3",
    author_name: "Sarah Johnson",
    content:
      "My father was the most patient person I've ever known. He taught me to fish when I was little, never getting frustrated when I tangled the line (which was often). That patience extended to everything he did. I'm trying to live up to that example with my own children.",
    created_at: "2022-09-05T16:42:00Z",
  },
  {
    id: "4",
    author_name: "Michael Anderson",
    content:
      "Pop, I miss our Sunday morning coffee talks. You always had the right advice, even when I didn't want to hear it. The workshop isn't the same without you, but I feel your presence every time I'm in there. I finished that cherry wood table you started - I think you'd be proud.",
    created_at: "2022-09-10T09:30:00Z",
  },
  {
    id: "5",
    author_name: "Thomas Wilson",
    content:
      "Robert was my colleague for over 25 years and my friend for even longer. His integrity in the workplace was unmatched, and his engineering solutions were always innovative. More importantly, he was the kind of friend who would drop everything to help you. The world lost a good man.",
    created_at: "2022-09-12T11:20:00Z",
  },
]

// Sample media items with consistent male images
const media = [
  {
    id: "1",
    url: "/images/robert-portrait.jpg",
    caption: "Robert at his 70th birthday celebration",
    display_order: 1,
  },
  {
    id: "2",
    url: "/images/robert-fishing.jpg",
    caption: "Fishing trip with the grandchildren, summer 2019",
    display_order: 2,
  },
  {
    id: "3",
    url: "/images/robert-anniversary.jpg",
    caption: "Robert and Margaret's 50th anniversary",
    display_order: 3,
  },
  {
    id: "4",
    url: "/images/robert-workshop.jpg",
    caption: "Robert in his workshop, crafting a rocking chair",
    display_order: 4,
  },
  {
    id: "5",
    url: "/images/robert-family.jpg",
    caption: "Family reunion, summer 2021",
    display_order: 5,
  },
  {
    id: "6",
    url: "/images/robert-military.jpg",
    caption: "Robert during his military service, 1965",
    display_order: 6,
  },
]

export default function SampleMemorialPage() {
  // Format dates for display
  const formattedBirthDate = memorial.birth_date ? format(new Date(memorial.birth_date), "MMMM d, yyyy") : null
  const formattedDeathDate = memorial.death_date ? format(new Date(memorial.death_date), "MMMM d, yyyy") : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Memorial Header */}
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={memorial.cover_image_url || `/placeholder.svg?height=400&width=800&text=${memorial.name}`}
              alt={memorial.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold">{memorial.name}</h1>
                {(formattedBirthDate || formattedDeathDate) && (
                  <p className="text-xl opacity-90">
                    {formattedBirthDate && formattedDeathDate
                      ? `${formattedBirthDate} - ${formattedDeathDate}`
                      : formattedBirthDate || formattedDeathDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sample Banner */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This is an example memorial page. Create your own memorial with Memorial QR.{" "}
                  <Link href="/checkout" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                    Get started today
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Memorial Content */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Bio */}
              {memorial.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Life Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{memorial.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Photo Gallery */}
              {media && media.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Photo Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {media.map((item) => (
                        <div key={item.id} className="relative aspect-square rounded-md overflow-hidden group">
                          <Image
                            src={item.url || "/placeholder.svg"}
                            alt={item.caption || "Memorial image"}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          {item.caption && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-end transition-all">
                              <p className="text-white p-2 opacity-0 group-hover:opacity-100 text-sm transition-opacity">
                                {item.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stories/Memories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Tributes & Memories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stories && stories.length > 0 ? (
                    <div className="space-y-6">
                      {stories.map((story) => (
                        <div key={story.id} className="border-b pb-6 last:border-0">
                          <p className="italic mb-3 text-gray-700">"{story.content}"</p>
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900">— {story.author_name}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(story.created_at), "MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No tributes have been shared yet.</p>
                  )}
                </CardContent>
              </Card>

              {/* Add Memory Form Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Memory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4 text-gray-500">
                    This is an example memorial. On a real memorial page, you would be able to share your own memories
                    here.
                  </p>
                  <div className="mt-4 text-center">
                    <Button asChild>
                      <Link href="/checkout">Create Your Own Memorial</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Memorial QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <QRImage value={`https://memorial-qr-website.vercel.app/memorial/sample-1`} size={200} />
                  <p className="text-sm text-center mt-4">
                    Scan this code to visit this memorial page or share with others
                  </p>
                </CardContent>
              </Card>

              {/* Memorial Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Memorial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formattedBirthDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Born</h4>
                      <p>{formattedBirthDate}</p>
                    </div>
                  )}
                  {formattedDeathDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Passed</h4>
                      <p>{formattedDeathDate}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tributes</h4>
                    <p>{stories?.length || 0} memories shared</p>
                  </div>
                </CardContent>
              </Card>

              {/* Share Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <Share2 className="h-5 w-5" />
                    Share This Memorial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="sm">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Create Your Own */}
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Create Your Own</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4">Honor your loved one with a beautiful digital memorial</p>
                  <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 w-full" asChild>
                    <Link href="/checkout">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
