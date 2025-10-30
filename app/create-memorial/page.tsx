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
import { User, Calendar, Upload, FileText, Users, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    location: "",

    // Step 2: Life Details
    occupation: "",
    hobbies: "",
    achievements: "",
    favoriteQuote: "",

    // Step 3: Photos & Media
    profilePhoto: null as File | null,
    additionalPhotos: [] as File[],

    // Step 4: Biography
    biography: "",
    personalStory: "",

    // Step 5: Family & Friends
    spouse: "",
    children: "",
    parents: "",
    siblings: "",
  })

  useEffect(() => {
    const order = searchParams.get("order")

    if (!order) {
      toast({
        title: "Access Denied",
        description: "Please complete your purchase first to create your memorial.",
        variant: "destructive",
      })
      router.push("/products")
      return
    }

    setOrderId(order)
  }, [searchParams, router, toast])

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

    // Simulate memorial creation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const memorialId = `MEM-${Date.now()}`

    toast({
      title: "Memorial Created Successfully!",
      description: `Your memorial has been created with ID: ${memorialId}`,
    })

    setIsSubmitting(false)

    // Redirect to success page
    router.push(`/memorial-success?id=${memorialId}&order=${orderId}`)
  }

  const progress = (currentStep / steps.length) * 100

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Required</h2>
            <p className="text-gray-600 mb-6">
              Please purchase a memorial product first to access the memorial creation form.
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <Header />

      {/* Order Confirmation Banner */}
      <div className="bg-green-50 border-b border-green-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Order Confirmed!</span>
            <span>Order #{orderId} • Now create your digital memorial</span>
          </div>
        </div>
      </div>

      {/* Progress Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Digital Memorial</h1>
              <p className="text-slate-600">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>

            <Progress value={progress} className="mb-8" />

            <div className="flex justify-between items-center">
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
                          ? "bg-purple-600 text-white"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }
                    `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm text-center ${isActive ? "font-semibold" : ""}`}>{step.title}</span>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfDeath">Date of Passing *</Label>
                      <Input
                        id="dateOfDeath"
                        type="date"
                        value={formData.dateOfDeath}
                        onChange={(e) => handleInputChange("dateOfDeath", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Life Details */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Life Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hobbies">Hobbies & Interests</Label>
                    <Textarea
                      id="hobbies"
                      value={formData.hobbies}
                      onChange={(e) => handleInputChange("hobbies", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="achievements">Achievements & Accomplishments</Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) => handleInputChange("achievements", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="favoriteQuote">Favorite Quote or Saying</Label>
                    <Input
                      id="favoriteQuote"
                      value={formData.favoriteQuote}
                      onChange={(e) => handleInputChange("favoriteQuote", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Photos & Media */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Photos & Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="profilePhoto">Profile Photo *</Label>
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("profilePhoto", e.target.files)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalPhotos">Additional Photos</Label>
                    <Input
                      id="additionalPhotos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload("additionalPhotos", e.target.files)}
                    />
                    <p className="text-sm text-slate-500 mt-1">{formData.additionalPhotos.length} photos uploaded</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Biography */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Biography & Life Story
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="biography">Biography *</Label>
                    <Textarea
                      id="biography"
                      value={formData.biography}
                      onChange={(e) => handleInputChange("biography", e.target.value)}
                      rows={6}
                      placeholder="Tell us about their life, personality, and what made them special..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="personalStory">Personal Story or Memory</Label>
                    <Textarea
                      id="personalStory"
                      value={formData.personalStory}
                      onChange={(e) => handleInputChange("personalStory", e.target.value)}
                      rows={4}
                      placeholder="Share a special memory or story that captures who they were..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Family & Friends */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family & Friends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="spouse">Spouse/Partner</Label>
                    <Input
                      id="spouse"
                      value={formData.spouse}
                      onChange={(e) => handleInputChange("spouse", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="children">Children</Label>
                    <Textarea
                      id="children"
                      value={formData.children}
                      onChange={(e) => handleInputChange("children", e.target.value)}
                      rows={2}
                      placeholder="List children's names..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="parents">Parents</Label>
                    <Input
                      id="parents"
                      value={formData.parents}
                      onChange={(e) => handleInputChange("parents", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="siblings">Siblings</Label>
                    <Textarea
                      id="siblings"
                      value={formData.siblings}
                      onChange={(e) => handleInputChange("siblings", e.target.value)}
                      rows={2}
                      placeholder="List siblings' names..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Review & Submit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">Memorial Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {formData.firstName} {formData.lastName}
                      </div>
                      <div>
                        <strong>Dates:</strong> {formData.dateOfBirth} - {formData.dateOfDeath}
                      </div>
                      <div>
                        <strong>Location:</strong> {formData.location}
                      </div>
                      <div>
                        <strong>Photos:</strong> {formData.additionalPhotos.length + (formData.profilePhoto ? 1 : 0)}
                      </div>
                      <div>
                        <strong>Order:</strong> #{orderId}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Your digital memorial will be created and activated</li>
                      <li>• Your physical memorial product will be manufactured</li>
                      <li>• You'll receive a QR code linking to the digital memorial</li>
                      <li>• Your memorial product will ship within 5-7 business days</li>
                    </ul>
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
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating Memorial...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
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
