import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Users, Eye, Calendar, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-serif flex items-center">
              Memorial QR
              <span className="text-yellow-400 ml-1">★</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/memorials" className="text-gray-600 hover:text-gray-900">
                My Memorials
              </Link>
              <Link href="/dashboard/account" className="text-gray-600 hover:text-gray-900">
                Account
              </Link>
              <Link href="/dashboard/support" className="text-gray-600 hover:text-gray-900">
                Support
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-1">Welcome back, John</h1>
            <p className="text-gray-600">Manage your memorial pages and view statistics</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Memorial
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Memorials</p>
                <h3 className="text-3xl font-bold">3</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <h3 className="text-3xl font-bold">247</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Stories</p>
                <h3 className="text-3xl font-bold">12</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <h3 className="text-3xl font-bold">+34%</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="memorials" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="memorials">My Memorials</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="stories">Pending Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="memorials">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Memorial Cards */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Memorial Image {i}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Memorial {i}</CardTitle>
                    <CardDescription>Created on {new Date().toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Views</p>
                        <p className="font-medium">{i * 50 + 47}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Stories</p>
                        <p className="font-medium">{i * 3 + 2}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Photos</p>
                        <p className="font-medium">{i * 5 + 10}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>The latest activity on your memorial pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                      <div className="bg-gray-100 rounded-full p-2 mr-4">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">New visitor from Chicago, IL</p>
                        <p className="text-sm text-gray-500">
                          {i} day{i !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories">
            <Card>
              <CardHeader>
                <CardTitle>Pending Stories</CardTitle>
                <CardDescription>Stories waiting for your approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">From: Sarah Johnson</p>
                          <p className="text-sm text-gray-500">Submitted on {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Decline
                          </Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">
                        "I have such fond memories of our time together. You were always there for me when I needed
                        someone to talk to, and your advice has guided me through many difficult times. I miss our long
                        conversations and your wonderful sense of humor."
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
