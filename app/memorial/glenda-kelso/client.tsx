"use client"

import { useState, useRef, useOptimistic } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addStory, addMessage, addPhoto } from "@/app/actions/memorial"
import QRCode from "qrcode"
import {
  Heart,
  Calendar,
  MapPin,
  MessageCircle,
  Users,
  Share2,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BookOpen,
  Camera,
} from "lucide-react"

type Memorial = {
  id: string
  slug: string
  full_name: string
  birth_date: string
  death_date: string
  location: string
  biography: string
  profile_image_url: string
}

type Story = {
  id: string
  author_name: string
  title: string
  content: string
  created_at: string
}

type Message = {
  id: string
  author_name: string
  content: string
  created_at: string
}

type Photo = {
  id: string
  image_url: string
  caption: string | null
  uploaded_by: string | null
  created_at: string
}

type MusicTrack = {
  id: string
  title: string
  artist: string | null
  audio_url: string
  duration: string | null
}

export function GlendaMemorialClient({
  memorial,
  initialStories,
  initialMessages,
  initialPhotos,
  initialMusic,
}: {
  memorial: Memorial
  initialStories: Story[]
  initialMessages: Message[]
  initialPhotos: Photo[]
  initialMusic: MusicTrack[]
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(0)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  const [optimisticStories, addOptimisticStory] = useOptimistic(initialStories, (state, newStory: Story) => [
    newStory,
    ...state,
  ])

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(initialMessages, (state, newMessage: Message) => [
    newMessage,
    ...state,
  ])

  const [optimisticPhotos, addOptimisticPhoto] = useOptimistic(initialPhotos, (state, newPhoto: Photo) => [
    newPhoto,
    ...state,
  ])

  const familyTree = [
    { name: "Glenda Jane Kelso", relation: "Self", dates: "July 27, 1952 - August 27, 2025" },
    { name: "Desmer McAnnally", relation: "Mother", dates: "Preceded in Death" },
    { name: "Lynn Kelso", relation: "Husband", dates: "Married 57 years" },
    { name: "Eddie Kelso", relation: "Son", dates: "" },
    { name: "Penny Collins", relation: "Daughter", dates: "" },
    { name: "Cole Collins", relation: "Grandson", dates: "" },
    { name: "Kristin Kelso", relation: "Granddaughter", dates: "" },
    { name: "Gracie Dean", relation: "Granddaughter", dates: "" },
    { name: "Braxton Phillips", relation: "Grandson", dates: "" },
    { name: "Weston Green", relation: "Grandson", dates: "" },
    { name: "Addalynn Rassman", relation: "Granddaughter", dates: "" },
    { name: "Wrenley Hunter", relation: "Granddaughter", dates: "" },
    { name: "Ridge Thompson", relation: "Grandson", dates: "" },
  ]

  const handleSignIn = (name: string) => {
    setCurrentUser(name)
    setIsSignedIn(true)
    setShowSignIn(false)
    toast({
      title: "Welcome!",
      description: `You're now signed in as ${name}. You can now contribute to Glenda's memorial.`,
    })
  }

  const handlePlayPause = (songIndex: number) => {
    if (currentSong !== songIndex) {
      setCurrentSong(songIndex)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  const handleAddStory = async (title: string, content: string) => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and story content.",
        variant: "destructive",
      })
      return
    }

    const optimisticStory: Story = {
      id: `temp-${Date.now()}`,
      author_name: currentUser,
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    }

    addOptimisticStory(optimisticStory)

    const result = await addStory(memorial.id, currentUser, title.trim(), content.trim())

    if (result.success) {
      toast({
        title: "Story Added",
        description: "Your story has been saved to Glenda's memorial.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to save story. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddMessage = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      })
      return
    }

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      author_name: currentUser,
      content: content.trim(),
      created_at: new Date().toISOString(),
    }

    addOptimisticMessage(optimisticMessage)

    const result = await addMessage(memorial.id, currentUser, content.trim())

    if (result.success) {
      toast({
        title: "Message Added",
        description: "Your message has been saved to Glenda's memorial.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to save message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPhoto = async (files: FileList | null, caption: string) => {
    if (!files || files.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one photo.",
        variant: "destructive",
      })
      return
    }

    // Note: In production, you would upload to storage (e.g., Vercel Blob) first
    // For now, we'll create object URLs as placeholders
    for (const file of Array.from(files)) {
      const imageUrl = URL.createObjectURL(file)

      const optimisticPhoto: Photo = {
        id: `temp-${Date.now()}-${Math.random()}`,
        image_url: imageUrl,
        caption: caption || `Photo added by ${currentUser}`,
        uploaded_by: currentUser,
        created_at: new Date().toISOString(),
      }

      addOptimisticPhoto(optimisticPhoto)

      // In production, upload to storage first, then save URL to database
      const result = await addPhoto(memorial.id, imageUrl, caption || `Photo added by ${currentUser}`, currentUser)

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to save photo. Please try again.",
          variant: "destructive",
        })
      }
    }

    toast({
      title: "Photos Added",
      description: `${files.length} photo(s) have been saved to Glenda's memorial.`,
    })
  }

  const handleShareMemorial = async () => {
    const memorialUrl = `${window.location.origin}/memorial/glenda-kelso`
    const shareData = {
      title: `Memorial for ${memorial.full_name}`,
      text: `Visit the memorial page for ${memorial.full_name}`,
      url: memorialUrl,
    }

    // Try Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast({
          title: "Shared Successfully",
          description: "Memorial link has been shared.",
        })
      } catch (error) {
        // User cancelled share
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error)
        }
      }
    } else {
      // Fallback: Copy to clipboard
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
      const memorialUrl = `${window.location.origin}/memorial/glenda-kelso`

      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(memorialUrl, {
        width: 800,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      // Create download link
      const link = document.createElement("a")
      link.href = qrCodeDataUrl
      link.download = `${memorial.slug}-memorial-qr-code.png`
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <audio
        ref={audioRef}
        src={initialMusic[currentSong]?.audio_url}
        volume={isMuted ? 0 : volume}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Image
                src={memorial.profile_image_url || "/placeholder.svg"}
                alt={memorial.full_name}
                width={300}
                height={300}
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-white shadow-2xl"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{memorial.full_name}</h1>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-xl">
                    {new Date(memorial.birth_date).toLocaleDateString()} -{" "}
                    {new Date(memorial.death_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-xl">{memorial.location}</span>
                </div>
              </div>
              <p className="text-xl text-slate-200 mb-8 max-w-2xl">{memorial.biography}</p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-red-500 text-white px-4 py-2 text-sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Beloved Wife
                </Badge>
                <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Devoted Mother
                </Badge>
                <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Cherished Grandmother
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Section */}
      {!isSignedIn && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-yellow-800 font-medium">Are you a family member or friend of Glenda?</p>
                <p className="text-yellow-700 text-sm">
                  Sign in to add photos, stories, and memories to this memorial.
                </p>
              </div>
              <Button onClick={() => setShowSignIn(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Sign In to Contribute
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About {memorial.full_name}</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  A life so beautifully lived deserves to be beautifully remembered. Today, we gather not only in sorrow
                  but in profound gratitude for the extraordinary woman we were blessed to know—Glenda Jane Kelso.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Glenda was the heart of her home and a force of nature in the lives of all who knew her. She left this
                  world as she lived in it: on her own terms, with a quick wit, and likely planning a joke we have yet
                  to discover. For 57 years, she was the devoted and loving partner to her husband, Lynn. She was a
                  selfless homemaker who dedicated her life to her children, Eddie and Penny, and to countless others
                  she welcomed into her heart and home as her own.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  To know Glenda was to be loved fiercely, laugh loudly, and feel truly spoiled. She was a woman of
                  beautiful contrasts: patient and kind, yet tough as nails. Her fanatic sense of humor was a light that
                  could cut through the hardest days, and her legendary chocolate gravy was a taste of her deep, abiding
                  love. She never let anyone forget who was really in charge, but she also never wavered in her loyalty,
                  sticking by her family even when the world said no.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Glenda found pure joy in the magic of the ordinary, especially when it brought smiles to the faces of
                  children. She delighted in dressing up for holidays, with Halloween holding a special place in her
                  heart, creating moments of wonder that will be cherished forever. Her happiness was found in the
                  noisy, loving chaos of being surrounded by family, though the steady chatter of the police scanner was
                  a close second.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  She was a curator of joy, a teller of hard truths, and the unwavering glue that held her family
                  together through good times and bad. Glenda's love was a vibrant tapestry woven with threads of
                  laughter, music, fierce protection, and an occasional, loving dose of stubbornness.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  We are certain that her reunion in Heaven with her beloved mother, Desmer, is filled with laughter and
                  a heavenly plan to keep a loving, watchful eye on us all.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Glenda's incredible legacy lives on in her husband, Lynn; her children, Eddie Kelso and Penny Collins;
                  her cherished grandchildren, Cole Collins, Kristin Kelso, Gracie Dean, Braxton Phillips, Weston Green,
                  Addalynn Rassman, Wrenley Hunter, and Ridge Thompson; her beautiful French daughter-in-love, Caroline;
                  her god-sent angels, Colton, Anzlie, and Remi; her children of the heart, Savannah (Bo) Pitts, Bama
                  Thompson, Taylor (Kelly) Hunter, and Jordan Thompson; and her special friends.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  We are fortunate, blessed, and endlessly grateful to have been loved by her. Though our hearts are
                  broken and we will miss her beyond measure, we find comfort in knowing that her spirit—her laughter,
                  her love, and her legendary chocolate gravy—will forever be a part of us.
                </p>

                <p className="text-lg leading-relaxed italic">
                  The family extends their deepest gratitude to the compassionate staff at Cullman Regional Medical
                  Center, Folsom Center Nursing Home, Cullman Dialysis Clinic, and Southern Care Hospice for the
                  dignity, kindness, and peace they provided in her final days.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold">Photo Gallery</h2>
                {isSignedIn && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photos
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Photos</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="photo-upload">Select Photos</Label>
                          <Input
                            id="photo-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const caption =
                                (document.getElementById("photo-caption") as HTMLTextAreaElement)?.value || ""
                              handleAddPhoto(e.target.files, caption)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="photo-caption">Caption (optional)</Label>
                          <Textarea id="photo-caption" placeholder="Add a caption for these photos..." />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {optimisticPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <Image
                      src={photo.image_url || "/placeholder.svg"}
                      alt={photo.caption || "Memorial photo"}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">{photo.caption}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="music">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Memorial Music</h2>
                  <p className="text-gray-600">Songs that were meaningful to Glenda</p>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {initialMusic.map((song, index) => (
                      <div key={song.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Button
                            size="sm"
                            variant={currentSong === index && isPlaying ? "default" : "outline"}
                            onClick={() => handlePlayPause(index)}
                          >
                            {currentSong === index && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <h4 className="font-medium">{song.title}</h4>
                            <p className="text-sm text-gray-600">{song.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                              className="w-16"
                            />
                          </div>
                          <span className="text-sm text-gray-600">{song.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Family Tree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyTree.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-lg">{member.name}</h4>
                        <p className="text-gray-600">{member.relation}</p>
                      </div>
                      {member.dates && <p className="text-sm text-gray-500">{member.dates}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold">Stories & Memories</h2>
                {isSignedIn && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Share a Story
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Share a Memory of Glenda</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="story-title">Story Title</Label>
                          <Input id="story-title" placeholder="Give your story a title..." />
                        </div>
                        <div>
                          <Label htmlFor="story-content">Your Story</Label>
                          <Textarea id="story-content" placeholder="Share your favorite memory of Glenda..." rows={6} />
                        </div>
                        <Button
                          onClick={() => {
                            const title = (document.getElementById("story-title") as HTMLInputElement)?.value || ""
                            const content =
                              (document.getElementById("story-content") as HTMLTextAreaElement)?.value || ""
                            handleAddStory(title, content)
                          }}
                          className="w-full"
                        >
                          Share Story
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {optimisticStories.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Stories Yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to share a memory of Glenda</p>
                    {!isSignedIn && <Button onClick={() => setShowSignIn(true)}>Sign In to Share a Story</Button>}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {optimisticStories.map((story) => (
                    <Card key={story.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          By {story.author_name} on {new Date(story.created_at).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{story.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold">Messages of Condolence</h2>
                {isSignedIn && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Leave a Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Leave a Message for the Family</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message-content">Your Message</Label>
                          <Textarea
                            id="message-content"
                            placeholder="Share your condolences or a message for the family..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            const content =
                              (document.getElementById("message-content") as HTMLTextAreaElement)?.value || ""
                            handleAddMessage(content)
                          }}
                          className="w-full"
                        >
                          Post Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {optimisticMessages.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Messages Yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to leave a message for the family</p>
                    {!isSignedIn && <Button onClick={() => setShowSignIn(true)}>Sign In to Leave a Message</Button>}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {optimisticMessages.map((message) => (
                    <Card key={message.id}>
                      <CardHeader>
                        <p className="text-sm text-gray-600">
                          By {message.author_name} on {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleShareMemorial}>
            <Share2 className="h-4 w-4" />
            Share Memorial
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleDownloadQRCode}>
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
          <Button asChild>
            <Link href="/pricing">Create Your Own Memorial</Link>
          </Button>
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In to Contribute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signin-name">Your Name</Label>
              <Input id="signin-name" placeholder="Enter your full name" />
            </div>
            <div>
              <Label htmlFor="signin-relationship">Relationship to Glenda</Label>
              <Input id="signin-relationship" placeholder="e.g., Daughter, Friend, Neighbor" />
            </div>
            <Button
              onClick={() => {
                const name = (document.getElementById("signin-name") as HTMLInputElement)?.value?.trim()
                if (name) {
                  handleSignIn(name)
                } else {
                  toast({
                    title: "Error",
                    description: "Please enter your name.",
                    variant: "destructive",
                  })
                }
              }}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
