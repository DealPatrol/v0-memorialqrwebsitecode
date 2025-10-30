"use client"

import type React from "react"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Heart, Calendar, MapPin, Users, MessageCircle, Share2, Sparkles, ArrowLeft, Download } from "lucide-react"
import { useState } from "react"
import QRCode from "qrcode"
import { useToast } from "@/hooks/use-toast"

export default function MemorialPage() {
  const params = useParams()
  const memorialId = params.id as string
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Sarah Johnson",
      message: "Such a beautiful memorial. Thank you for sharing these wonderful memories.",
      date: "2024-01-15",
    },
    {
      id: 2,
      author: "Michael Smith",
      message: "Will always remember the kindness and warmth. Rest in peace.",
      date: "2024-01-14",
    },
  ])

  const isSample = memorialId?.startsWith("SAMPLE-")

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        author: "Anonymous Visitor",
        message: newMessage,
        date: new Date().toISOString().split("T")[0],
      }
      setMessages([message, ...messages])
      setNewMessage("")
    }
  }

  const handleShareMemorial = async () => {
    const memorialUrl = `${window.location.origin}/memorial/${memorialId}`
    const shareData = {
      title: "Memorial for John Michael Smith",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Sample Memorial Banner */}
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

      {/* Memorial Header */}
      <section className="py-16 bg-gradient-to-br from-slate-100 to-purple-100">
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

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center">
                  <img
                    src="/elderly-man-smiling-portrait.png"
                    alt="Memorial Portrait"
                    className="w-44 h-44 rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 text-left">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">John Michael Smith</h1>
                  <p className="text-xl text-slate-600 mb-4">Beloved Father, Husband, and Friend</p>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>March 15, 1945 - December 8, 2023</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Springfield, Illinois</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Heart className="w-4 h-4 mr-2" />
                      Leave Tribute
                    </Button>
                    <Button variant="outline" onClick={handleShareMemorial}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Memorial
                    </Button>
                    <Button variant="outline" onClick={handleDownloadQRCode}>
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memorial Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Biography */}
                <Card>
                  <CardHeader>
                    <CardTitle>Life Story</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      John Michael Smith was born on March 15, 1945, in Springfield, Illinois, to loving parents Robert
                      and Helen Smith. He grew up as the eldest of three children, always looking out for his younger
                      siblings with a protective and caring nature that would define him throughout his life.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      After graduating from Springfield High School in 1963, John served his country proudly in the
                      United States Army during the Vietnam War. Upon returning home, he met the love of his life, Mary
                      Elizabeth Johnson, at a local church social in 1968. They married two years later and built a
                      beautiful life together spanning over 53 years.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      John worked as a dedicated teacher at Lincoln Elementary School for 35 years, touching the lives
                      of countless children and families. He was known for his patience, kindness, and ability to make
                      learning fun. Even after retirement, former students would often visit to thank him for the
                      positive impact he had on their lives.
                    </p>
                  </CardContent>
                </Card>

                {/* Photo Gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle>Photo Memories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <img
                        src="/family-gathering-outdoor-picnic.png"
                        alt="Family gathering"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <img
                        src="/elderly-man-teaching-children-classroom.png"
                        alt="Teaching moment"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <img
                        src="/family-hiking-mountain-trail-together.png"
                        alt="Family hiking"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Story */}
                <Card>
                  <CardHeader>
                    <CardTitle>A Special Memory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed italic">
                      "Every Christmas morning, Dad would wake up before dawn to prepare his famous pancakes for the
                      whole family. He'd wear his old red apron and hum Christmas carols while cooking. Even when we all
                      grew up and had families of our own, he insisted on continuing this tradition. The kitchen would
                      be filled with laughter, the smell of vanilla and cinnamon, and Dad's infectious joy. It wasn't
                      just about the pancakes – it was about his love for bringing the family together and creating
                      moments we'd treasure forever."
                    </p>
                    <p className="text-sm text-slate-500 mt-4">- Shared by Sarah, loving daughter</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Family Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Family
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">Spouse</h4>
                      <p className="text-slate-600">Mary Elizabeth Smith</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Children</h4>
                      <p className="text-slate-600">Michael Smith, Sarah Johnson, David Smith</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Grandchildren</h4>
                      <p className="text-slate-600">Emma, Jake, Lily, Noah, Grace</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Siblings</h4>
                      <p className="text-slate-600">James Smith, Lisa Brown</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Life Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Life Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">Occupation</h4>
                      <p className="text-slate-600">Elementary School Teacher</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Hobbies</h4>
                      <p className="text-slate-600">Gardening, fishing, woodworking, reading</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Favorite Quote</h4>
                      <p className="text-slate-600 italic">
                        "The best teachers are those who show you where to look, but don't tell you what to see."
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Memorial Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Memorial Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Visitors</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Messages</span>
                      <span className="font-semibold">{messages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Photos</span>
                      <span className="font-semibold">12</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Messages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Messages of Love & Remembrance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Message Form */}
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <Textarea
                    placeholder="Share a memory, leave a message of comfort, or express your condolences..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Leave Message
                  </Button>
                </form>

                {/* Messages List */}
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900">{message.author}</h4>
                        <span className="text-sm text-slate-500">{message.date}</span>
                      </div>
                      <p className="text-slate-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
