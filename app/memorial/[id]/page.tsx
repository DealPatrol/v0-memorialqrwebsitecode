import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddMemoryForm from "@/components/add-memory-form"
import { QRImage } from "@/components/qr-image"
import { FamilyTree } from "@/components/family-tree/family-tree"
import { format } from "date-fns"
import { MessageCircle, Share2, Calendar, Heart } from "lucide-react"

// Helper function to get base URL that works in all environments
function getBaseUrl() {
  // For server-side rendering, we can't rely on window.location
  // So we use the environment variable if available, or a default URL
  return process.env.NEXT_PUBLIC_SITE_URL || "https://memorial-qr-website.vercel.app"
}

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: memorial } = await supabase.from("memorials").select("*").eq("id", params.id).single()

  if (!memorial) {
    return {
      title: "Memorial Not Found",
    }
  }

  return {
    title: `${memorial.name} | Memorial QR`,
    description: memorial.bio || `In loving memory of ${memorial.name}`,
  }
}

export default async function MemorialPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()
  const baseUrl = getBaseUrl()

  // Get memorial data
  const { data: memorial, error: memorialError } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", params.id)
    .single()

  if (memorialError || !memorial) {
    notFound()
  }

  // Get media for this memorial
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("memorial_id", params.id)
    .order("display_order", { ascending: true })

  // Get approved stories for this memorial
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .eq("memorial_id", params.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  // Get QR code for this memorial
  const { data: qrCode } = await supabase.from("qr_codes").select("*").eq("memorial_id", params.id).single()

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

              {/* Family Tree Section */}
              <FamilyTree memorialId={params.id} />

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
                        <div key={item.id} className="relative aspect-square rounded-md overflow-hidden">
                          <Image
                            src={item.url || "/placeholder.svg"}
                            alt={item.caption || "Memorial image"}
                            fill
                            className="object-cover"
                          />
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

              {/* Add Memory Form */}
              <AddMemoryForm memorialId={params.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Memorial QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {qrCode ? (
                    <QRImage value={`${baseUrl}/qr/${qrCode.unique_code}`} size={200} />
                  ) : (
                    <p>QR code not available</p>
                  )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
