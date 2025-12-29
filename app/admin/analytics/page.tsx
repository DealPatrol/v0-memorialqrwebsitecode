"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, Package, Heart, TrendingUp, Calendar, Mail, Clock, Image, Video, Music, MessageSquare } from 'lucide-react'
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  totalUsers: number
  recentUsers: Array<{
    id: string
    email: string
    created_at: string
  }>
  totalOrders: number
  recentOrders: Array<any>
  totalRevenue: number
  totalMemorials: number
  recentMemorials: Array<any>
  contentStats: {
    photos: number
    videos: number
    music: number
    stories: number
    messages: number
    milestones: number
  }
  ordersByStatus: Record<string, number>
  ordersByPackage: Record<string, number>
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d")
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const now = new Date()
      let dateFilter = new Date(0).toISOString()
      if (timeRange === "24h") {
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      } else if (timeRange === "7d") {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      } else if (timeRange === "30d") {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      const { data: memorialsData } = await supabase
        .from("memorials")
        .select("*")
        .order("created_at", { ascending: false })

      const { data: photosData } = await supabase.from("photos").select("id")
      const { data: videosData } = await supabase.from("videos").select("id")
      const { data: musicData } = await supabase.from("music").select("id")
      const { data: storiesData } = await supabase.from("stories").select("id")
      const { data: messagesData } = await supabase.from("messages").select("id")
      const { data: milestonesData } = await supabase.from("milestones").select("id")

      const totalRevenue = (ordersData || []).reduce((sum, order) => sum + (order.amount_cents || 0), 0)

      const ordersByStatus = (ordersData || []).reduce(
        (acc, order) => {
          acc[order.status || "unknown"] = (acc[order.status || "unknown"] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const ordersByPackage = (ordersData || []).reduce(
        (acc, order) => {
          acc[order.product_name || "unknown"] = (acc[order.product_name || "unknown"] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const uniqueEmails = new Set((ordersData || []).map((o) => o.customer_email).filter(Boolean))

      setData({
        totalUsers: uniqueEmails.size,
        recentUsers: Array.from(uniqueEmails)
          .slice(0, 10)
          .map((email, idx) => ({
            id: `user-${idx}`,
            email: email as string,
            created_at: new Date().toISOString(),
          })),
        totalOrders: ordersData?.length || 0,
        recentOrders: (ordersData || []).slice(0, 10),
        totalRevenue,
        totalMemorials: memorialsData?.length || 0,
        recentMemorials: (memorialsData || []).slice(0, 10),
        contentStats: {
          photos: photosData?.length || 0,
          videos: videosData?.length || 0,
          music: musicData?.length || 0,
          stories: storiesData?.length || 0,
          messages: messagesData?.length || 0,
          milestones: milestonesData?.length || 0,
        },
        ordersByStatus,
        ordersByPackage,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive view of all platform data</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange("24h")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === "24h"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === "7d"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === "30d"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{data.totalUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">Unique customers</p>
                  </div>
                  <Users className="h-12 w-12 text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">${(data.totalRevenue / 100).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">All time earnings</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{data.totalOrders}</p>
                    <p className="text-xs text-gray-500 mt-1">Completed purchases</p>
                  </div>
                  <Package className="h-12 w-12 text-blue-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Memorials</p>
                    <p className="text-3xl font-bold text-pink-600 mt-2">{data.totalMemorials}</p>
                    <p className="text-xs text-gray-500 mt-1">Created memorials</p>
                  </div>
                  <Heart className="h-12 w-12 text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="memorials">Memorials</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Order Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders by Status</CardTitle>
                  <CardDescription>Current order distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(data.ordersByStatus).map(([status, count]) => (
                      <div key={status} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Package Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders by Package</CardTitle>
                  <CardDescription>Popular package distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data.ordersByPackage).map(([pkg, count]) => (
                      <div key={pkg} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{pkg}</span>
                        <Badge variant="secondary">{count} orders</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Content</CardTitle>
                  <CardDescription>User-generated content across all memorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Image className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Photos</p>
                        <p className="text-2xl font-bold text-gray-900">{data.contentStats.photos}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <Video className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Videos</p>
                        <p className="text-2xl font-bold text-gray-900">{data.contentStats.videos}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                      <Music className="h-8 w-8 text-pink-600" />
                      <div>
                        <p className="text-sm text-gray-600">Music</p>
                        <p className="text-2xl font-bold text-gray-900">{data.contentStats.music}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Stories</p>
                        <p className="text-2xl font-bold text-gray-900">{data.contentStats.stories}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Messages</p>
                        <p className="text-2xl font-bold text-gray-900">{data.contentStats.messages}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Milestones</p>
                        <p className="text-2xl font-bold text-gray-900">{data.contentStats.milestones}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest 10 orders placed on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-gray-900">{order.order_number}</p>
                            <Badge className={order.status === "completed" ? "bg-green-100 text-green-800" : ""}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${(order.amount_cents / 100).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="memorials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Memorials</CardTitle>
                  <CardDescription>Latest memorials created on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentMemorials.map((memorial) => (
                      <div key={memorial.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Heart className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{memorial.full_name}</p>
                          <p className="text-sm text-gray-600">
                            {memorial.birth_date} - {memorial.death_date}
                          </p>
                          {memorial.location && <p className="text-sm text-gray-500">{memorial.location}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(memorial.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Media Content</CardTitle>
                    <CardDescription>Photos, videos, and music uploads</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image className="h-6 w-6 text-blue-600" />
                        <span className="font-medium">Photos</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{data.contentStats.photos}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="h-6 w-6 text-purple-600" />
                        <span className="font-medium">Videos</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{data.contentStats.videos}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="h-6 w-6 text-pink-600" />
                        <span className="font-medium">Music Tracks</span>
                      </div>
                      <span className="text-2xl font-bold text-pink-600">{data.contentStats.music}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Contributions</CardTitle>
                    <CardDescription>Stories, messages, and milestones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                        <span className="font-medium">Stories</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{data.contentStats.stories}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-orange-600" />
                        <span className="font-medium">Messages</span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">{data.contentStats.messages}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-yellow-600" />
                        <span className="font-medium">Milestones</span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-600">{data.contentStats.milestones}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
