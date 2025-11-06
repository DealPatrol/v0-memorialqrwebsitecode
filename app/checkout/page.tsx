"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

const PRODUCTS = {
  memorial: {
    id: "online_memorial",
    name: "Online Memorial",
    oneTimePrice: 2.0,
  },
  plaques: {
    silver: {
      id: "silver_plaque",
      name: "Silver Memorial Plaque",
      description: "Premium silver finish with engraved QR code",
      image: "/plaque-silver.jpg",
    },
    gold: {
      id: "gold_plaque",
      name: "Gold Memorial Plaque",
      description: "Elegant gold finish with engraved QR code",
      image: "/plaque-gold.jpg",
    },
    black: {
      id: "black_plaque",
      name: "Black Memorial Plaque",
      description: "Classic black finish with engraved QR code",
      image: "/plaque-black.jpg",
    },
  },
  addons: {
    woodenQR: {
      id: "wooden_qr",
      name: "Wooden QR Code",
      description: "Natural wood finish with laser-engraved QR code",
      price: 29.97,
      image: "/wooden-keychain.png",
    },
    picturePlaque: {
      id: "picture_plaque",
      name: "Picture Plaque",
      description: "Custom photo plaque with memorial details",
      price: 39.98,
      image: "/aluminum-card.jpg",
    },
    stoneQR: {
      id: "stone_qr",
      name: "Stone QR Code",
      description: "Durable stone memorial with engraved QR code",
      price: 56.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e4de3d0a-3087-4815-924d-3bcb93c7a20d.jpg",
    },
  },
}

export default function CheckoutPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    plaqueType: "black" as "silver" | "gold" | "black",
    boxPersonalization: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    sessionStorage.setItem("checkoutStep1", JSON.stringify(formData))
    router.push("/checkout/details")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />

      {/* Luxury Box Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 border-accent/30 shadow-xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full min-h-[300px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/box1-ddkM8m6r7XISkEEH5qA6RU6DblzyIK.jpg"
                    alt="Luxury Memorial Presentation Box"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-6">
                    <p className="text-white text-lg font-semibold drop-shadow-lg">
                      Receive your own special, custom design
                    </p>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-background to-accent/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-8 w-8 text-accent" />
                    <h2 className="text-2xl font-bold text-foreground">Luxury Presentation Box</h2>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Every order arrives in an elegant presentation box, adding a priceless touch to your memorial.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-medium">Premium quality packaging</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-medium">Personalization available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-medium">Included with every order at no extra cost</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-2">
                    <Label htmlFor="boxPersonalization" className="text-sm font-semibold">
                      Personalize Your Box
                    </Label>
                    <Textarea
                      id="boxPersonalization"
                      name="boxPersonalization"
                      placeholder="In Memory of John Doe..."
                      value={formData.boxPersonalization}
                      onChange={(e) => setFormData({ ...formData, boxPersonalization: e.target.value })}
                      maxLength={150}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{formData.boxPersonalization.length}/150 characters</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Selection Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Plaque Color Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plaque Color</CardTitle>
                <p className="text-sm text-muted-foreground">Included with your memorial package</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.plaqueType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, plaqueType: value as "silver" | "gold" | "black" })
                  }
                  className="grid md:grid-cols-3 gap-6"
                >
                  {Object.entries(PRODUCTS.plaques).map(([key, plaque]) => (
                    <div
                      key={key}
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        formData.plaqueType === key
                          ? "border-accent ring-2 ring-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setFormData({ ...formData, plaqueType: key as "silver" | "gold" | "black" })}
                    >
                      <div className="relative h-32 w-full">
                        <Image
                          src={plaque.image || "/placeholder.svg"}
                          alt={plaque.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="p-4 bg-background">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={key} id={key} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={key} className="font-semibold cursor-pointer block mb-1">
                              {plaque.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{plaque.description}</p>
                          </div>
                        </div>
                      </div>
                      {formData.plaqueType === key && (
                        <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <Button onClick={handleNext} size="lg" className="gap-2">
                Next
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
