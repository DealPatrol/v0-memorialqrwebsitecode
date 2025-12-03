"use client"

import type React from "react"
import { Upload, MusicIcon, VideoIcon, BookOpen, Calendar } from 'lucide-react'
import Image from "next/image"

import { useParams } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Heart, MapPin, MessageCircle, Sparkles, ArrowLeft, ImageIcon } from 'lucide-react'
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
  image_url: string
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
  theme: string | null // Added theme field
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

  const handleUploadComplete = () => {
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
      }
    }
    fetchPhotos()
  }

  const handleBulkUploadComplete = () => {
    setBulkUploadDialogOpen(false)
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/photos`)
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
          setBrokenImages(new Set())
          toast({
            title: "Photos added",
            description: "Your photos have been added to the memorial",
          })
        }
      } catch (error) {
      }
    }
    fetchPhotos()
  }

  const handleVideoUploadComplete = () => {
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
      }
    }
    fetchVideos()
  }

  const handleBulkVideoUploadComplete = () => {
    setBulkVideoUploadDialogOpen(false)
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/videos`)
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos || [])
          toast({
            title: "Videos added",
            description: "Your videos have been added to the memorial",
          })
        }
      } catch (error) {
      }
    }
    fetchVideos()
  }

  const handleMusicUploadComplete = () => {
    setMusicUploadDialogOpen(false)
    const fetchMusic = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/music`)
        if (response.ok) {
          const data = await response.json()
          setMusic(data.music || [])
          toast({
            title: "Audio added",
            description: "Your audio has been added to the memorial",
          })
        }
      } catch (error) {
      }
    }
    fetchMusic()
  }

  const handleMilestoneAdded = () => {
    setMilestoneDialogOpen(false)
    const fetchMilestones = async () => {
      try {
        const response = await fetch(`/api/memorials/${memorialId}/milestones`)
        if (response.ok) {
          const data = await response.json()
          setMilestones(data.milestones || [])
          toast({
            title: "Milestone added",
            description: "Your milestone has been added to the timeline",
          })
        }
      } catch (error) {
      }
    }
    fetchMilestones()
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const response = await fetch(`/api/milestones/${milestoneId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMilestones(milestones.filter((m) => m.id !== milestoneId))
        toast({
          title: "Milestone deleted",
          description: "The milestone has been removed",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      })
    }
  }

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !newMessageAuthor.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name and message",
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
          description: "Your message has been added to the memorial",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post message",
        variant: "destructive",
      })
    } finally {
      setSubmittingMessage(false)
    }
  }

  const handleSubmitStory = async () => {
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
          description: "Your memory has been added to the memorial",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share story",
        variant: "destructive",
      })
    } finally {
      setSubmittingStory(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const handleImageError = (photoId: string, imageUrl: string) => {
    setBrokenImages((prev) => new Set(prev).add(photoId))
  }

  const validPhotos = photos.filter((photo) => {
    const isBrowserBlob = photo.image_url.startsWith("blob:")
    return !isBrowserBlob && !brokenImages.has(photo.id)
  })

  const brokenPhotos = photos.filter((photo) => {
    const isBrowserBlob = photo.image_url.startsWith("blob:")
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

      <section className={`py-12 ${memorial?.theme === "classic" ? "bg-white" : selectedTheme.colors.background}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold ${selectedTheme.colors.text} mb-1`}>Memorial Content</h2>
              <p className={`text-sm ${selectedTheme.colors.text}`}>Explore photos, videos, stories, and messages</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Photos Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <CardTitle className="text-base">Photos</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-purple-600">{validPhotos.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-slate-600 mb-2">View and share photo memories</p>
                  <div className="flex gap-2">
                    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs h-8">
                          <Upload className="mr-1 h-3 w-3" />
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
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs h-8">
                          Bulk Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Bulk Upload Photos</DialogTitle>
                          <DialogDescription>Upload multiple photos at once</DialogDescription>
                        </DialogHeader>
                        <BulkPhotoUpload memorialId={memorialId} onUploadComplete={handleBulkUploadComplete} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Videos Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VideoIcon className="w-4 h-4 text-blue-600" />
                      <CardTitle className="text-base">Videos</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{videos.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-slate-600 mb-2">Share video memories</p>
                  <div className="flex gap-2">
                    <Dialog open={videoUploadDialogOpen} onOpenChange={setVideoUploadDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs h-8">
                          <Upload className="mr-1 h-3 w-3" />
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
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs h-8">
                          Bulk Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Bulk Upload Videos</DialogTitle>
                          <DialogDescription>Upload multiple videos at once</DialogDescription>
                        </DialogHeader>
                        <BulkVideoUpload memorialId={memorialId} onUploadComplete={handleBulkVideoUploadComplete} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Stories Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <CardTitle className="text-base">Memories</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-amber-600">{stories.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-slate-600 mb-2">Share stories and memories</p>
                  <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full bg-transparent text-xs h-8">
                        <Upload className="mr-1 h-3 w-3" />
                        Share Memory
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share a Memory</DialogTitle>
                        <DialogDescription>Tell a story about your time together</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="storyAuthor">Your Name</Label>
                          <Input
                            id="storyAuthor"
                            value={newStory.author}
                            onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                            placeholder="Enter your name..."
                            disabled={submittingStory}
                          />
                        </div>
                        <div>
                          <Label htmlFor="storyTitle">Memory Title</Label>
                          <Input
                            id="storyTitle"
                            value={newStory.title}
                            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                            placeholder="Give your memory a title..."
                            disabled={submittingStory}
                          />
                        </div>
                        <div>
                          <Label htmlFor="storyContent">Your Memory</Label>
                          <Textarea
                            id="storyContent"
                            value={newStory.content}
                            onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                            placeholder="Share your memory..."
                            rows={6}
                            disabled={submittingStory}
                          />
                        </div>
                        <Button onClick={handleSubmitStory} disabled={submittingStory} className="w-full">
                          {submittingStory ? "Sharing..." : "Share Memory"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Messages Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <CardTitle className="text-base">Messages</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-green-600">{messages.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-slate-600 mb-2">Leave condolences and tributes</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent text-xs h-8"
                    onClick={() => {
                      document.getElementById("visitor-log-section")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <Heart className="mr-1 h-3 w-3" />
                    Leave Message
                  </Button>
                </CardContent>
              </Card>

              {/* Music Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MusicIcon className="w-4 h-4 text-rose-600" />
                      <CardTitle className="text-base">Voicemails/Audio</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-rose-600">{music.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-slate-600 mb-2">Share voicemails and audio memories</p>
                  <Dialog open={musicUploadDialogOpen} onOpenChange={setMusicUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full bg-transparent text-xs h-8">
                        <Upload className="mr-1 h-3 w-3" />
                        Add Audio
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Voicemail/Audio</DialogTitle>
                        <DialogDescription>Share a meaningful song, voicemail, or audio memory</DialogDescription>
                      </DialogHeader>
                      <MusicUpload memorialId={memorialId} onUploadComplete={handleMusicUploadComplete} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <CardTitle className="text-base">Timeline</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-indigo-600">{milestones.length}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-xs text-slate-600 mb-2">Life milestones and events</p>
                  <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full bg-transparent text-xs h-8">
                        <Upload className="mr-1 h-3 w-3" />
                        Add Milestone
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Milestone</DialogTitle>
                        <DialogDescription>Add an important life event to the timeline</DialogDescription>
                      </DialogHeader>
                      <MilestoneForm memorialId={memorialId} onSuccess={handleMilestoneAdded} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Memorial Activity Summary Card */}
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-blue-50 md:col-span-2 lg:col-span-3">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Contributions</span>
                    <span className="font-bold text-purple-600 text-lg">
                      {validPhotos.length + videos.length + stories.length + messages.length + music.length}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Join others in honoring this memorial</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {memorial?.biography && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Life Story</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{memorial.biography}</div>
                    </CardContent>
                  </Card>
                )}

                {/* Timeline Section */}
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
                              <strong>Note:</strong> {brokenPhotos.length} photo{brokenPhotos.length > 1 ? "s" : ""}{" "}
                              could not be loaded due to temporary storage links. Please re-upload these photos to make
                              them permanent.
                            </p>
                          </div>
                        )}

                        {validPhotos.length > 0 ? (
                          <div className="grid md:grid-cols-3 gap-4">
                            {validPhotos.map((photo) => (
                              <div key={photo.id} className="space-y-2">
                                <Image
                                  src={photo.image_url || "/placeholder.svg"}
                                  alt={photo.caption || "Memorial photo"}
                                  width={400}
                                  height={300}
                                  className="w-full h-48 object-cover rounded-lg"
                                  onError={() => handleImageError(photo.id, photo.image_url)}
                                />
                                {photo.caption && <p className="text-sm text-slate-600">{photo.caption}</p>}
                                {photo.uploaded_by && (
                                  <p className="text-xs text-slate-500">Photo added by {photo.uploaded_by}</p>
                                )}
                              </div>
                            ))}
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

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Add Photo
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setVideoUploadDialogOpen(true)}
                    >
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setStoryDialogOpen(true)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Share Memory
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => {
                        document.getElementById("visitor-log-section")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Leave Message
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setMusicUploadDialogOpen(true)}
                    >
                      <MusicIcon className="w-4 h-4 mr-2" />
                      Add Audio
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setMilestoneDialogOpen(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Add Milestone
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                <form onSubmit={handleSubmitMessage} className="space-y-4">
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
}
