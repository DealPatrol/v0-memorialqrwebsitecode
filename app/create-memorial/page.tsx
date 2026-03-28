"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import { User, Calendar, Upload, FileText, Users, CheckCircle, ArrowRight, ArrowLeft, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ThemeSelector } from "@/components/theme-selector"

const steps = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Life Details", icon: Calendar },
  { id: 3, title: "Photos & Media", icon: Upload },
  { id: 4, title: "Biography", icon: FileText },
  { id: 5, title: "Family & Friends", icon: Users },
  { id: 6, title: "Review & Submit", icon: CheckCircle },
]

export default function CreateMemorialPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [orderId, setOrderId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isFreePlan, setIsFreePlan] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [customerName, setCustomerName] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      const welcomeParam = searchParams.get("welcome")
      const orderIdParam = searchParams.get("orderId")

      if (welcomeParam === "true" && user) {
        setShowWelcome(true)
        // Extract first name from email or metadata
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there"
        setCustomerName(name.split(" ")[0])
      }

      if (orderIdParam) {
        const { data: order } = await supabase.from("orders").select("*").eq("id", orderIdParam).single()

        if (order) {
          setOrderData({
            customerEmail: order.customer_email || user?.email || "",
            customerName: order.customer_name || user?.user_metadata?.full_name || "",
            orderId: order.id,
            packageType: order.product_name || "basic",
          })
          setOrderId(`ORDER-${order.id}`)
          setIsCheckingAuth(false)
          return
        }
      }

      const planParam = searchParams.get("plan")

      if (planParam === "free") {
        setIsFreePlan(true)
        setOrderData({
          customerEmail: user?.email || "",
          customerName: user?.user_metadata?.full_name || "",
          orderId: null,
          packageType: "free",
        })
        setOrderId(`FREE-${Date.now()}`)
        setIsCheckingAuth(false)
        return
      }

      const pendingOrderData = sessionStorage.getItem("pendingOrder")

      if (!pendingOrderData) {
        setOrderData({
          customerEmail: user?.email || "",
          customerName: user?.user_metadata?.full_name || "",
          orderId: null,
          packageType: "basic",
        })
        setOrderId(`ANON-${Date.now()}`)
        setIsCheckingAuth(false)
        return
      }

      try {
        const parsedOrderData = JSON.parse(pendingOrderData)
        setOrderData(parsedOrderData)
        setOrderId(`ORDER-${parsedOrderData.orderId || Date.now()}`)
      } catch (error) {
        console.error("Error parsing order data:", error)
        setOrderData({
          customerEmail: user?.email || "",
          customerName: user?.user_metadata?.full_name || "",
          orderId: null,
          packageType: "basic",
        })
        setOrderId(`ANON-${Date.now()}`)
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router, toast, searchParams])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    location: "",
    theme: "classic",
    occupation: "",
    hobbies: "",
    achievements: "",
    favoriteQuote: "",
    profilePhoto: null as File | null,
    additionalPhotos: [] as File[],
    biography: "",
    personalStory: "",
    spouse: "",
    children: "",
    parents: "",
    siblings: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return

    if (field === "additionalPhotos") {
      const newPhotos = Array.from(files)
      setFormData((prev) => ({
        ...prev,
        additionalPhotos: [...prev.additionalPhotos, ...newPhotos],
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: files[0] }))
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      let profileImageUrl = null

      if (formData.profilePhoto) {
        const formDataBlob = new FormData()
        formDataBlob.append("file", formData.profilePhoto)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataBlob,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          profileImageUrl = uploadData.url
        } else {
          toast({
            title: "Warning",
            description: "Profile photo upload failed, continuing with memorial creation...",
            variant: "destructive",
          })
        }
      }

      const memorialResponse = await fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          dateOfDeath: formData.dateOfDeath,
          location: formData.location,
          biography: formData.biography,
          customerEmail: user?.email || orderData.customerEmail,
          customerName: user?.user_metadata?.full_name || orderData.customerName,
          userId: user?.id || null,
          profileImageUrl: profileImageUrl,
          theme: formData.theme,
          packageType: isFreePlan ? "free" : orderData.packageType || "basic",
        }),
      })

      if (!memorialResponse.ok) {
        const errorData = await memorialResponse.json()
        throw new Error(errorData.error || "Failed to create memorial")
      }

      const { memorial } = await memorialResponse.json()

      if (formData.additionalPhotos.length > 0) {
        for (const photo of formData.additionalPhotos) {
          try {
            const photoFormData = new FormData()
            photoFormData.append("file", photo)
            photoFormData.append("memorialId", memorial.id)
            photoFormData.append("caption", photo.name)
            photoFormData.append("uploaderName", orderData.customerName || "Memorial Creator")

            await fetch("/api/photos/upload", {
              method: "POST",
              body: photoFormData,
            })
          } catch (photoError) {
            console.error("Error uploading photo:", photoError)
          }
        }
      }

      if (orderData.orderId && !isFreePlan) {
        await fetch("/api/orders/link-memorial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            memorialId: memorial.id,
          }),
        })
      }

      sessionStorage.removeItem("pendingOrder")

      toast({
        title: "Memorial Created Successfully!",
        description: isFreePlan
          ? "Your free memorial is now live! Upgrade anytime to unlock more features."
          : "Your memorial is now live and ready to share.",
      })

      router.push(`/memorial/${memorial.id}`)
    } catch (error: any) {
      console.error("Error creating memorial:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create memorial. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-zinc-400">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderData) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {showWelcome && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-2 text-white text-center">
              <Heart className="w-8 h-8 animate-pulse" />
              <h2 className="text-2xl font-bold">Welcome back, {customerName}!</h2>
              <p className="text-amber-100 max-w-md">
                Thank you for your purchase. You're ready to create a beautiful memorial for your loved one.
              </p>
              <Button
                variant="secondary"
                className="mt-2 bg-white text-amber-600 hover:bg-amber-50"
                onClick={() => setShowWelcome(false)}
              >
                Let's Get Started
              </Button>
            </div>
          </div>
        </div>
      )}

      {!showWelcome && !isFreePlan && orderData.orderId && (
        <div className="bg-green-900/50 border-b border-green-800 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Payment Confirmed!</span>
              <span className="text-green-300">Now create your digital memorial</span>
            </div>
          </div>
        </div>
      )}

      {isFreePlan && (
        <div className="bg-blue-900/50 border-b border-blue-800 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Free Memorial</span>
              <span className="text-blue-300">Create your memorial at no cost</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Header */}
      <section className="py-8 bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Your Digital Memorial</h1>
              <p className="text-zinc-400">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>

            <Progress value={progress} className="mb-8 bg-zinc-800" />

            <div className="hidden md:flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                      ${
                        isActive
                          ? "bg-amber-500 text-black"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-zinc-800 text-zinc-500"
                      }
                    `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm text-center ${isActive ? "font-semibold text-white" : "text-zinc-500"}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-white">Memorial Theme</Label>
                    <p className="text-sm text-zinc-400 mb-4">
                      Choose a theme that reflects your loved one's personality and life
                    </p>
                    <ThemeSelector value={formData.theme} onChange={(theme) => handleInputChange("theme", theme)} />
                  </div>

                  <div className="border-t border-zinc-800 pt-6">
                    <Label className="text-base font-semibold mb-3 block text-white">Personal Details</Label>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="firstName" className="text-zinc-300">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-zinc-300">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="dateOfBirth" className="text-zinc-300">
                          Date of Birth *
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          required
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfDeath" className="text-zinc-300">
                          Date of Passing *
                        </Label>
                        <Input
                          id="dateOfDeath"
                          type="date"
                          value={formData.dateOfDeath}
                          onChange={(e) => handleInputChange("dateOfDeath", e.target.value)}
                          required
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="location" className="text-zinc-300">
                        Location *
                      </Label>
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Life Details */}
            {currentStep === 2 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    Life Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="occupation" className="text-zinc-300">
                      Occupation
                    </Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hobbies" className="text-zinc-300">
                      Hobbies & Interests
                    </Label>
                    <Textarea
                      id="hobbies"
                      value={formData.hobbies}
                      onChange={(e) => handleInputChange("hobbies", e.target.value)}
                      rows={3}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="achievements" className="text-zinc-300">
                      Achievements & Accomplishments
                    </Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) => handleInputChange("achievements", e.target.value)}
                      rows={3}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="favoriteQuote" className="text-zinc-300">
                      Favorite Quote or Saying
                    </Label>
                    <Input
                      id="favoriteQuote"
                      value={formData.favoriteQuote}
                      onChange={(e) => handleInputChange("favoriteQuote", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Photos & Media */}
            {currentStep === 3 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Upload className="w-5 h-5" />
                    Photos & Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="profilePhoto" className="text-zinc-300">
                      Profile Photo *
                    </Label>
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("profilePhoto", e.target.files)}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white file:bg-zinc-700 file:text-white file:border-0"
                    />
                    <p className="text-sm text-zinc-500 mt-1">Upload a photo of your loved one</p>
                  </div>

                  <div>
                    <Label htmlFor="additionalPhotos" className="text-zinc-300">
                      Additional Photos
                    </Label>
                    <Input
                      id="additionalPhotos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload("additionalPhotos", e.target.files)}
                      className="bg-zinc-800 border-zinc-700 text-white file:bg-zinc-700 file:text-white file:border-0"
                    />
                    <p className="text-sm text-zinc-500 mt-1">{formData.additionalPhotos.length} photos uploaded</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Biography */}
            {currentStep === 4 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5" />
                    Biography & Life Story
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="biography" className="text-zinc-300">
                      Biography *
                    </Label>
                    <Textarea
                      id="biography"
                      value={formData.biography}
                      onChange={(e) => handleInputChange("biography", e.target.value)}
                      rows={6}
                      placeholder="Tell us about their life, personality, and what made them special..."
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="personalStory" className="text-zinc-300">
                      Personal Story or Memory
                    </Label>
                    <Textarea
                      id="personalStory"
                      value={formData.personalStory}
                      onChange={(e) => handleInputChange("personalStory", e.target.value)}
                      rows={4}
                      placeholder="Share a special memory or story that captures who they were..."
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Family & Friends */}
            {currentStep === 5 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5" />
                    Family & Friends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="spouse" className="text-zinc-300">
                      Spouse/Partner
                    </Label>
                    <Input
                      id="spouse"
                      value={formData.spouse}
                      onChange={(e) => handleInputChange("spouse", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="children" className="text-zinc-300">
                      Children
                    </Label>
                    <Textarea
                      id="children"
                      value={formData.children}
                      onChange={(e) => handleInputChange("children", e.target.value)}
                      rows={2}
                      placeholder="Names of children..."
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parents" className="text-zinc-300">
                      Parents
                    </Label>
                    <Input
                      id="parents"
                      value={formData.parents}
                      onChange={(e) => handleInputChange("parents", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="siblings" className="text-zinc-300">
                      Siblings
                    </Label>
                    <Textarea
                      id="siblings"
                      value={formData.siblings}
                      onChange={(e) => handleInputChange("siblings", e.target.value)}
                      rows={2}
                      placeholder="Names of siblings..."
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5" />
                    Review & Submit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg text-white">Memorial Summary</h3>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-400">Name:</span>
                        <p className="text-white font-medium">
                          {formData.firstName} {formData.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Dates:</span>
                        <p className="text-white font-medium">
                          {formData.dateOfBirth} - {formData.dateOfDeath}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Location:</span>
                        <p className="text-white font-medium">{formData.location || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Theme:</span>
                        <p className="text-white font-medium capitalize">{formData.theme}</p>
                      </div>
                    </div>

                    {formData.biography && (
                      <div className="border-t border-zinc-700 pt-4">
                        <span className="text-zinc-400 text-sm">Biography Preview:</span>
                        <p className="text-white mt-1 line-clamp-3">{formData.biography}</p>
                      </div>
                    )}

                    <div className="border-t border-zinc-700 pt-4">
                      <span className="text-zinc-400 text-sm">Photos:</span>
                      <p className="text-white">
                        {formData.profilePhoto ? "1 profile photo" : "No profile photo"},{" "}
                        {formData.additionalPhotos.length} additional photos
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-900/30 border border-amber-800 rounded-lg p-4">
                    <p className="text-amber-200 text-sm">
                      By submitting, you confirm that you have the right to create this memorial and that all
                      information is accurate to the best of your knowledge.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="bg-amber-500 hover:bg-amber-600 text-black">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.firstName || !formData.lastName}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Memorial...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Memorial
                    </>
                  )}
                </Button>
              )}
            </div>
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
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/products?category=plaques" className="hover:text-white">
                    Memorial Plaques
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=stones" className="hover:text-white">
                    Memorial Stones
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=monuments" className="hover:text-white">
                    Monuments
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=pet" className="hover:text-white">
                    Pet Memorials
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
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
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
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
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
