import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Shield, Clock, Heart } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "California",
    image: "/professional-woman-diverse.png",
    rating: 5,
    quote:
      "Memorial QR helped us create a beautiful tribute to my father. The QR code on his headstone allows visitors to see his life story and photos. It's been such a comfort to our family.",
    productPhoto: "/memorial-plaque-on-headstone.jpg",
    verified: true,
  },
  {
    name: "Michael Chen",
    location: "Texas",
    image: "/professional-asian-man.png",
    rating: 5,
    quote:
      "The process was so easy and the support team was incredibly helpful. Our family can now share memories and photos in one place. The luxury box presentation was stunning.",
    productPhoto: "/luxury-memorial-box-with-plaque.jpg",
    verified: true,
  },
  {
    name: "Lisa Rodriguez",
    location: "Florida",
    image: "/professional-latina-woman.png",
    rating: 5,
    quote:
      "What a wonderful way to keep mom's memory alive. Friends and family love being able to access her photos and stories anytime. The wooden QR necklace is beautiful.",
    productPhoto: "/wooden-qr-code-necklace-being-worn.jpg",
    verified: true,
  },
  {
    name: "David Martinez",
    location: "Arizona",
    image: "/professional-hispanic-man.png",
    rating: 5,
    quote:
      "I was skeptical at first, but this exceeded all expectations. The quality of the plaque is outstanding, and the digital memorial is so easy to update with new photos and memories.",
    productPhoto: "/gold-memorial-plaque-close-up.jpg",
    verified: true,
  },
  {
    name: "Emily Thompson",
    location: "New York",
    image: "/professional-woman-glasses.png",
    rating: 5,
    quote:
      "Our grandfather served in WWII, and this memorial lets us share his service photos and stories with future generations. The lifetime hosting means his legacy will never be lost.",
    productPhoto: "/military-memorial-with-american-flag.jpg",
    verified: true,
  },
  {
    name: "James Wilson",
    location: "Ohio",
    image: "/professional-older-man.png",
    rating: 5,
    quote:
      "After losing my wife, this memorial has been a source of comfort. I can visit her page anytime and read the messages from friends and family. It's like she's still with us.",
    productPhoto: "/silver-memorial-plaque-at-cemetery.jpg",
    verified: true,
  },
]

export function CustomerTestimonials() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Families Choose Us</h2>
          <p className="text-xl text-muted-foreground">Our commitment to honoring your loved ones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Lifetime Hosting */}
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lifetime Hosting</h3>
              <p className="text-muted-foreground">
                Your memorial stays online forever. One payment, no subscriptions, no renewals.
              </p>
            </CardContent>
          </Card>

          {/* Secure & Private */}
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your photos and memories are protected. You control who can view and contribute.
              </p>
            </CardContent>
          </Card>

          {/* Made with Care */}
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Made with Care</h3>
              <p className="text-muted-foreground">
                Each plaque is handcrafted with attention to detail. We understand this matters.
              </p>
            </CardContent>
          </Card>

          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={testimonial.productPhoto || "/placeholder.svg"}
                  alt={`${testimonial.name}'s memorial`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-semibold text-green-600 flex items-center gap-1">
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Purchase
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full px-6 py-3">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-foreground">Quality Guaranteed</span>
            <span className="text-muted-foreground">or your money back</span>
          </div>
        </div>
      </div>
    </section>
  )
}
