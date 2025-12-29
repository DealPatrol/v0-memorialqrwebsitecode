import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "California",
    image: "/diverse-woman-smiling.png",
    rating: 5,
    quote:
      "Memorial QR helped me create a beautiful tribute to my Golden Retriever, Max. The QR code on his garden stone allows us to revisit his puppy photos and happy moments. It's so comforting.",
    productPhoto: "/dog-memorial-stone.jpg",
    verified: true,
  },
  {
    name: "Michael Chen",
    location: "Texas",
    image: "/smiling-man.png",
    rating: 5,
    quote:
      "Losing our cat Luna was heartbreaking. This digital memorial lets us share her funny videos and sweet moments with friends. The setup was incredibly easy.",
    productPhoto: "/cat-memorial.png",
    verified: true,
  },
  {
    name: "Lisa Rodriguez",
    location: "Florida",
    image: "/woman-portrait.png",
    rating: 5,
    quote:
      "I got a QR tag for my horse's stall plaque. Everyone at the stable loves scanning it to see his competition highlights and baby photos. Such a special way to remember him.",
    productPhoto: "/horse-memorial.jpg",
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Real Stories from Pet Parents</h2>
          <p className="text-xl text-muted-foreground">
            Over 5,000 families trust Memorial QR to honor their beloved pets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-6 py-3">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">4.9/5</span>
            <span className="text-muted-foreground">from 2,847 reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
