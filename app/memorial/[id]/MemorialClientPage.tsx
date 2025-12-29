"use client"
import { Upload, MusicIcon, VideoIcon, BookOpen, Calendar } from "lucide-react"
import Image from "next/image"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Heart, MapPin, MessageCircle, Sparkles, ArrowLeft, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { useToast } from "@/hooks/use-toast"
import { SocialShareButtons } from "@/components/social-share-buttons"
import { PhotoUpload } from "@/components/photo-upload"
import { VideoUpload } from "@/components/video-upload"
import { MusicUpload } from "@/components/music-upload"
import { TimelineView } from "@/components/timeline-view"
import { MilestoneForm } from "@/components/milestone-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BulkPhotoUpload } from "@/components/bulk-photo-upload"
import { BulkVideoUpload } from "@/components/bulk-video-upload"
import { ExportMemorialDialog } from "@/components/export-memorial-dialog"
import { ShareMemorialDialog } from "@/components/share-memorial-dialog"
import { themes } from "@/components/theme-selector"

interface Photo {
  id: string
  image_url?: string
  photo_url?: string
  caption: string | null
  uploaded_by: string | null
  created_at: string
}

interface VideoType {
  id: string
  video_url: string
  title: string
  uploaded_by: string | null
  created_at: string
}

interface Story {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
}

interface Message {
  id: string
  content: string
  author_name: string
  created_at: string
}

interface Music {
  id: string
  title: string
  artist: string | null
  audio_url: string
  duration: string | null
  created_at: string
  is_youtube?: boolean
  youtube_id?: string
}

interface Memorial {
  id: string
  full_name: string
  slug: string
  biography: string | null
  birth_date: string | null
  death_date: string | null
  location: string | null
  profile_image_url: string | null
  theme: string | null
}

interface Milestone {
  id: string
  title: string
  description: string
  date: string
  category: string
  image_url?: string
}

export function MemorialClientPage() {
  const params = useParams()
  const memorialId = params.id as string
  const [newMessage, setNewMessage] = useState("")
  const [newMessageAuthor, setNewMessageAuthor] = useState("")
  const [newStory, setNewStory] = useState({ title: "", content: "", author: "" })
  const { toast } = useToast()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [videoUploadDialogOpen, setVideoUploadDialogOpen] = useState(false)
  const [storyDialogOpen, setStoryDialogOpen] = useState(false)
  const [musicUploadDialogOpen, setMusicUploadDialogOpen] = useState(false)
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false)
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false)
  const [bulkVideoUploadDialogOpen, setBulkVideoUploadDialogOpen] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [videos, setVideos] = useState<VideoType[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [music, setMusic] = useState<Music[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [loadingStories, setLoadingStories] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [loadingMusic, setLoadingMusic] = useState(true)
  const [loadingMilestones, setLoadingMilestones] = useState(true)
  const [memorial, setMemorial] = useState<Memorial | null>(null)
  const [loadingMemorial, setLoadingMemorial] = useState(true)
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())
  const [submittingMessage, setSubmittingMessage] = useState(false)
  const [submittingStory, setSubmittingStory] = useState(false)

  const isSample = memorialId?.startsWith("SAMPLE-")

  const selectedTheme = themes.find((t) => t.id === (memorial?.theme || "classic")) || themes[0]

  const getPhotoUrl = (photo: Photo): string => {
    return photo.image_url || photo.photo_url || "/placeholder.svg"
  }

  useEffect(() => {
    const fetchMemorial = async () => {
      try {
        console.log("[v0] Fetching memorial:", memorialId)
        const response = await fetch(`/api/memorials/${memorialId}`)
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Fetched memorial:", data)
          setMemorial(data.memorial)
        } else {
          console.error("[v0] Failed to fetch memorial:", response.status)
          toast({
            title: "Memorial not found",
            description: "The memorial you're looking for doesn't exist.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching memorial:", error)
      } finally {
        setLoadingMemorial(false)
      }
    }

    if (memorialId && !isSample) {
      fetchMemorial()
    } else {
      setLoadingMemorial(false)
    }
  }, [memorialId, isSample, toast])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        console.log("[v0] Fetching photos for memorial:", memorialId)
        const response = await fetch(`/api/memorials/${memorialId}/photos`)
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Fetched photos:", data.photos)
          setPhotos(data.photos || [])
        } else {
          console.error("[v0] Failed to fetch photos:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching photos:", error)
      } finally {
        setLoadingPhotos(false)
      }
    }

    if (memorialId && !isSample) {
      fetchPhotos()
    } else {
      setLoadingPhotos(false)
    }
  }, [memorialId, isSample])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/videos`)
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching videos:", error)
      } finally {
        setLoadingVideos(false)
      }
    }

    if (memorialId && !isSample) {
      fetchVideos()
    } else {
      setLoadingVideos(false)
    }
  }, [memorialId, isSample])

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/stories`)
        if (response.ok) {
          const data = await response.json()
          setStories(data.stories || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching stories:", error)
      } finally {
        setLoadingStories(false)
      }
    }

    if (memorialId && !isSample) {
      fetchStories()
    } else {
      setLoadingStories(false)
    }
  }, [memorialId, isSample])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching messages:", error)
      } finally {
        setLoadingMessages(false)
      }
    }

    if (memorialId && !isSample) {
      fetchMessages()
    } else {
      setLoadingMessages(false)
    }
  }, [memorialId, isSample])

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/music`)
        if (response.ok) {
          const data = await response.json()
          setMusic(data.music || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching music:", error)
      } finally {
        setLoadingMusic(false)
      }
    }

    if (memorialId && !isSample) {
      fetchMusic()
    } else {
      setLoadingMusic(false)
    }
  }, [memorialId, isSample])

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/milestones`)
        if (response.ok) {
          const data = await response.json()
          setMilestones(data.milestones || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching milestones:", error)
      } finally {
        setLoadingMilestones(false)
      }
    }

    if (memorialId && !isSample) {
      fetchMilestones()
    } else {
      setLoadingMilestones(false)
    }
  }, [memorialId, isSample])

  const handleShareMemorial = async () => {
    const memorialUrl = `${window.location.origin}/memorial/${memorialId}`
    const shareData = {
      title: `Memorial for ${memorial?.full_name || "Loved One"}`,
      text: "Visit this memorial page",
      url: memorialUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast({
          title: "Shared Successfully",
          description: "Memorial link has been shared.",
        })
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(memorialUrl)
        toast({
          title: "Link Copied",
          description: "Memorial link has been copied to your clipboard.",
        })
      } catch (error) {
        console.error("Error copying to clipboard:", error)
        toast({
          title: "Error",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDownloadQRCode = async () => {
    try {
      const memorialUrl = `${window.location.origin}/memorial/${memorialId}`

      const qrCodeDataUrl = await QRCode.toDataURL(memorialUrl, {
        width: 800,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      const link = document.createElement("a")
      link.href = qrCodeDataUrl
      link.download = `memorial-${memorialId}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "QR Code Downloaded",
        description: "The QR code has been saved to your device.",
      })
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageError = (photoId: string, imageUrl: string) => {
    console.log("[v0] Image failed to load:", imageUrl)
    setBrokenImages((prev) => new Set(prev).add(photoId))
  }

  const validPhotos = photos.filter((photo) => {
    const photoUrl = getPhotoUrl(photo)
    const isBrowserBlob = photoUrl.startsWith("blob:")
    return !isBrowserBlob && !brokenImages.has(photo.id)
  })

  const brokenPhotos = photos.filter((photo) => {
    const photoUrl = getPhotoUrl(photo)
    const isBrowserBlob = photoUrl.startsWith("blob:")
    return isBrowserBlob || brokenImages.has(photo.id)
  })

  if (loadingMemorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-slate-600">Loading memorial...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!memorial && !isSample) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Memorial Not Found</h1>
            <p className="text-slate-600 mb-6">The memorial you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/browse-memorials">Browse Memorials</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${selectedTheme.colors.background}`}>
      <Header />

      {isSample && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Sample Memorial</span>
              <span>• Demo Version • For Showcase Purposes</span>
            </div>
          </div>
        </div>
      )}

      <section className={`py-16 ${selectedTheme.colors.background}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Button asChild variant="ghost" size="sm">
                <Link href="/browse-memorials">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Memorials
                </Link>
              </Button>
            </div>

            <div
              className={`${selectedTheme.colors.card} p-8 rounded-lg shadow-lg border ${memorial?.theme !== "classic" ? "border" : ""}`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div
                  className={`w-48 h-48 bg-gradient-to-br ${memorial?.theme === "classic" ? "from-purple-200 to-blue-200" : "from-white/20 to-white/10"} rounded-full flex items-center justify-center overflow-hidden`}
                >
                  <Image
                    src={memorial?.profile_image_url || "/placeholder.svg?height=176&width=176"}
                    alt="Memorial Portrait"
                    width={176}
                    height={176}
                    className="w-44 h-44 rounded-full object-cover"
                    priority
                    onError={(e) => {
                      // Fallback to blank avatar if image fails to load
                      const target = e.currentTarget as HTMLImageElement
                      target.src = "/placeholder.svg?height=176&width=176"
                    }}
                  />
                </div>

                <div className="flex-1 text-left">
                  <h1 className={`text-4xl font-bold ${selectedTheme.colors.text} mb-2`}>
                    {memorial?.full_name || "Memorial"}
                  </h1>
                  <p className={`text-xl ${selectedTheme.colors.accent} mb-4`}>Beloved and Remembered</p>

                  <div className={`grid md:grid-cols-2 gap-4 text-sm ${selectedTheme.colors.text}`}>
                    {(memorial?.birth_date || memorial?.death_date) && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {memorial?.birth_date ? formatDate(memorial.birth_date) : "Unknown"} -{" "}
                          {memorial?.death_date ? formatDate(memorial.death_date) : "Unknown"}
                        </span>
                      </div>
                    )}
                    {memorial?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{memorial.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 mt-6">
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Heart className="w-4 h-4 mr-2" />
                        Leave Tribute
                      </Button>
                      <ShareMemorialDialog memorialId={memorialId} memorialName={memorial?.full_name || "Memorial"} />
                      <ExportMemorialDialog memorialId={memorialId} memorialName={memorial?.full_name || "Memorial"} />
                    </div>
                    <div className="pt-2 border-t">
                      <p className={`text-sm ${selectedTheme.colors.text} mb-2`}>Share on social media:</p>
                      <SocialShareButtons
                        url={`${typeof window !== "undefined" ? window.location.origin : ""}/memorial/${memorialId}`}
                        title={`Memorial for ${memorial?.full_name || "Loved One"}`}
                        description={`Visit this memorial page to honor and remember ${memorial?.full_name || "a loved one"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${selectedTheme.colors.background}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {memorial?.biography && (
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">{memorial.biography}</p>
                </CardContent>
              </Card>
            )}

            {!isSample && (
              <div className="flex flex-wrap gap-3">
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Photo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Photo</DialogTitle>
                      <DialogDescription>Share a photo memory</DialogDescription>
                    </DialogHeader>
                    <PhotoUpload memorialId={memorialId} onUploadComplete={handleUploadComplete} />
                  </DialogContent>
                </Dialog>

                <Dialog open={bulkUploadDialogOpen} onOpenChange={setBulkUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Add Multiple Photos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload Multiple Photos</DialogTitle>
                      <DialogDescription>Upload multiple photos at once</DialogDescription>
                    </DialogHeader>
                    <BulkPhotoUpload memorialId={memorialId} onUploadComplete={handleBulkUploadComplete} />
                  </DialogContent>
                </Dialog>

                <Dialog open={videoUploadDialogOpen} onOpenChange={setVideoUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <VideoIcon className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Video</DialogTitle>
                      <DialogDescription>Share a video memory</DialogDescription>
                    </DialogHeader>
                    <VideoUpload memorialId={memorialId} onUploadComplete={handleVideoUploadComplete} />
                  </DialogContent>
                </Dialog>

                <Dialog open={bulkVideoUploadDialogOpen} onOpenChange={setBulkVideoUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Add Multiple Videos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload Multiple Videos</DialogTitle>
                      <DialogDescription>Upload multiple videos at once</DialogDescription>
                    </DialogHeader>
                    <BulkVideoUpload memorialId={memorialId} onUploadComplete={handleBulkVideoUploadComplete} />
                  </DialogContent>
                </Dialog>

                <Dialog open={musicUploadDialogOpen} onOpenChange={setMusicUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <MusicIcon className="mr-2 h-4 w-4" />
                      Add Music
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Music</DialogTitle>
                      <DialogDescription>Upload an audio file or add a YouTube link</DialogDescription>
                    </DialogHeader>
                    <MusicUpload memorialId={memorialId} onUploadComplete={handleMusicUploadComplete} />
                  </DialogContent>
                </Dialog>

                <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Share Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share a Story</DialogTitle>
                      <DialogDescription>Share a meaningful memory or story</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="story-title">Story Title</Label>
                        <Input
                          id="story-title"
                          value={newStory.title}
                          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                          placeholder="Give your story a title..."
                          disabled={submittingStory}
                        />
                      </div>
                      <div>
                        <Label htmlFor="story-content">Your Story</Label>
                        <Textarea
                          id="story-content"
                          value={newStory.content}
                          onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                          placeholder="Share your memory or story..."
                          rows={6}
                          disabled={submittingStory}
                        />
                      </div>
                      <div>
                        <Label htmlFor="story-author">Your Name</Label>
                        <Input
                          id="story-author"
                          value={newStory.author}
                          onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                          placeholder="Enter your name..."
                          disabled={submittingStory}
                        />
                      </div>
                      <Button onClick={handleSubmitStory} disabled={submittingStory} className="w-full">
                        {submittingStory ? "Submitting..." : "Share Story"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Life Milestone</DialogTitle>
                      <DialogDescription>Add an important moment from their life</DialogDescription>
                    </DialogHeader>
                    <MilestoneForm memorialId={memorialId} onComplete={handleMilestoneComplete} />
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {!loadingMilestones && milestones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Life Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimelineView milestones={milestones} onDelete={handleDeleteMilestone} canEdit={false} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Photo Memories</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPhotos ? (
                  <div className="text-center py-8 text-slate-500">Loading photos...</div>
                ) : (
                  <>
                    {brokenPhotos.length > 0 && (
                      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> {brokenPhotos.length} photo{brokenPhotos.length > 1 ? "s" : ""} could
                          not be loaded due to temporary storage links. Please re-upload these photos to make them
                          permanent.
                        </p>
                      </div>
                    )}

                    {validPhotos.length > 0 ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {validPhotos.map((photo) => {
                          const photoUrl = getPhotoUrl(photo)
                          return (
                            <div key={photo.id} className="space-y-2">
                              <Image
                                src={photoUrl || "/placeholder.svg"}
                                alt={photo.caption || "Memorial photo"}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover rounded-lg"
                                onError={() => handleImageError(photo.id, photoUrl)}
                              />
                              {photo.caption && <p className="text-sm text-slate-600">{photo.caption}</p>}
                              {photo.uploaded_by && (
                                <p className="text-xs text-slate-500">Photo added by {photo.uploaded_by}</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">
                          {brokenPhotos.length > 0
                            ? "All photos need to be re-uploaded. Click 'Add Photo' above to upload new photos."
                            : "No photos yet. Be the first to share a memory!"}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VideoIcon className="w-5 h-5" />
                  Video Memories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingVideos ? (
                  <div className="text-center py-8 text-slate-500">Loading videos...</div>
                ) : videos.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div key={video.id} className="space-y-2">
                        <video src={video.video_url} controls className="w-full rounded-lg">
                          Your browser does not support the video element.
                        </video>
                        <h4 className="font-semibold text-sm">{video.title}</h4>
                        {video.uploaded_by && (
                          <p className="text-xs text-slate-500">Video added by {video.uploaded_by}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No videos yet. Be the first to share a video memory!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Memories & Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStories ? (
                  <div className="text-center py-8 text-slate-500">Loading stories...</div>
                ) : stories.length > 0 ? (
                  <div className="space-y-4">
                    {stories.map((story) => (
                      <div key={story.id} className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-1">{story.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">
                          By {story.author_name} on {formatDate(story.created_at)}
                        </p>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{story.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No stories yet. Be the first to share a memory!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {!loadingMusic && music.length > 0 && (
              <Card id="music-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MusicIcon className="w-5 h-5" />
                    Voicemails & Audio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {music.map((song) => (
                      <div key={song.id} className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <MusicIcon className="w-4 h-4 text-purple-600" />
                          <div>
                            <h4 className="font-semibold text-sm">{song.title}</h4>
                            {song.artist && <p className="text-xs text-slate-500">{song.artist}</p>}
                          </div>
                        </div>
                        {song.is_youtube && song.youtube_id ? (
                          <div className="aspect-video w-full">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${song.youtube_id}`}
                              title={song.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-lg"
                            />
                          </div>
                        ) : (
                          <audio
                            controls
                            className="w-full"
                            src={song.audio_url}
                            preload="metadata"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLAudioElement
                              const error = target.error
                              console.error("[v0] Audio playback error:", {
                                songId: song.id,
                                title: song.title,
                                audioUrl: song.audio_url,
                                errorCode: error?.code,
                                errorMessage: error?.message,
                                networkState: target.networkState,
                                readyState: target.readyState,
                              })
                              toast({
                                title: "Audio playback error",
                                description: `Unable to play "${song.title}". The file format may not be supported by your browser.`,
                                variant: "destructive",
                              })
                            }}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section id="visitor-log-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Visitor Log & Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitMessage()
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="messageAuthor">Your Name</Label>
                    <Input
                      id="messageAuthor"
                      placeholder="Enter your name..."
                      value={newMessageAuthor}
                      onChange={(e) => setNewMessageAuthor(e.target.value)}
                      disabled={submittingMessage}
                    />
                  </div>
                  <div>
                    <Label htmlFor="messageContent">Your Message</Label>
                    <Textarea
                      id="messageContent"
                      placeholder="Share a memory, leave a message of comfort, or express your condolences..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                      disabled={submittingMessage}
                    />
                  </div>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={submittingMessage}>
                    <Heart className="w-4 h-4 mr-2" />
                    {submittingMessage ? "Posting..." : "Leave Message"}
                  </Button>
                </form>

                {loadingMessages ? (
                  <div className="text-center py-8 text-slate-500">Loading messages...</div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-900">{message.author_name}</h4>
                          <span className="text-sm text-slate-500">{formatDate(message.created_at)}</span>
                        </div>
                        <p className="text-slate-700">{message.content}</p>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-slate-500">No messages yet. Be the first to leave a message!</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-slate-400 text-sm">Honoring memories with digital memorials that last forever.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-white">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )

  function formatDate(dateString: string | null) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  async function handleUploadComplete() {
    setUploadDialogOpen(false)
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/photos`)
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
          setBrokenImages(new Set())
          toast({
            title: "Photo added",
            description: "Your photo has been added to the memorial",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching photos:", error)
      }
    }
    fetchPhotos()
  }

  async function handleBulkUploadComplete() {
    setBulkUploadDialogOpen(false)
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/photos`)
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
          setBrokenImages(new Set())
          toast({
            title: "Photos uploaded",
            description: "Your photos have been added to the memorial",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching photos:", error)
      }
    }
    fetchPhotos()
  }

  async function handleVideoUploadComplete() {
    setVideoUploadDialogOpen(false)
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/videos`)
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos || [])
          toast({
            title: "Video added",
            description: "Your video has been added to the memorial",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching videos:", error)
      }
    }
    fetchVideos()
  }

  async function handleBulkVideoUploadComplete() {
    setBulkVideoUploadDialogOpen(false)
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/videos`)
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos || [])
          toast({
            title: "Videos uploaded",
            description: "Your videos have been added to the memorial",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching videos:", error)
      }
    }
    fetchVideos()
  }

  async function handleMusicUploadComplete() {
    setMusicUploadDialogOpen(false)
    const fetchMusic = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/music`)
        if (response.ok) {
          const data = await response.json()
          setMusic(data.music || [])
          toast({
            title: "Music added",
            description: "The music has been added to the memorial",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching music:", error)
      }
    }
    fetchMusic()
  }

  async function handleMilestoneComplete() {
    setMilestoneDialogOpen(false)
    const fetchMilestones = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/milestones`)
        if (response.ok) {
          const data = await response.json()
          setMilestones(data.milestones || [])
          toast({
            title: "Milestone added",
            description: "The milestone has been added to the timeline",
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching milestones:", error)
      }
    }
    fetchMilestones()
  }

  async function handleDeleteMilestone(milestoneId: string) {
    try {
      const response = await fetch(`/api/milestones/${milestoneId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const fetchMilestones = async () => {
          const response = await fetch(`/api/memorials/${memorialId}/milestones`)
          if (response.ok) {
            const data = await response.json()
            setMilestones(data.milestones || [])
          }
        }
        fetchMilestones()
        toast({
          title: "Milestone deleted",
          description: "The milestone has been removed from the timeline",
        })
      }
    } catch (error) {
      console.error("[v0] Error deleting milestone:", error)
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      })
    }
  }

  async function handleSubmitMessage() {
    if (!newMessage.trim() || !newMessageAuthor.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both your name and message",
        variant: "destructive",
      })
      return
    }

    setSubmittingMessage(true)

    try {
      const response = await fetch(`/api/memorials/${memorialId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          author_name: newMessageAuthor,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([data.message, ...messages])
        setNewMessage("")
        setNewMessageAuthor("")
        toast({
          title: "Message posted",
          description: "Your message has been shared",
        })
      } else {
        throw new Error("Failed to post message")
      }
    } catch (error) {
      console.error("[v0] Error posting message:", error)
      toast({
        title: "Error",
        description: "Failed to post your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingMessage(false)
    }
  }

  async function handleSubmitStory() {
    if (!newStory.title.trim() || !newStory.content.trim() || !newStory.author.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setSubmittingStory(true)

    try {
      const response = await fetch(`/api/memorials/${memorialId}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newStory.title,
          content: newStory.content,
          author_name: newStory.author,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setStories([data.story, ...stories])
        setNewStory({ title: "", content: "", author: "" })
        setStoryDialogOpen(false)
        toast({
          title: "Story shared",
          description: "Your story has been posted",
        })
      } else {
        throw new Error("Failed to post story")
      }
    } catch (error) {
      console.error("[v0] Error posting story:", error)
      toast({
        title: "Error",
        description: "Failed to share your story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingStory(false)
    }
  }
}
