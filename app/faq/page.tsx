import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Header } from "@/components/header"
import { HelpCircle, Phone, Mail } from "lucide-react"
import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Memorial QR FAQ | Print-on-Demand Keepsakes | Common Questions",
  description:
    "Answers to frequently asked questions about Memorial QR products, fulfillment, pricing, and $4.99 monthly digital hosting.",
  keywords:
    "memorial QR FAQ Calgary, print-on-demand memorial products, pet memorial QR answers, digital memorial hosting Alberta",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Memorial QR FAQ | Calgary Northeast",
    description:
      "Get answers about memorial QR codes, installation, product pricing, and monthly digital hosting.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://memorialsqr.com"}/faq`,
  },
}

const faqCategories = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "How do I create a memorial?",
        answer:
          "Creating a memorial is simple! Click 'Create Memorial' and fill out our guided form with your loved one's information, photos, and stories. The process takes about 15-20 minutes, and you can save your progress at any time.",
      },
      {
        question: "What information do I need to provide?",
        answer:
          "You'll need basic information like their full name, birth and death dates, location, and a biography. You can also upload photos, add family information, hobbies, achievements, and a meaningful quote. The more you share, the richer the memorial becomes.",
      },
      {
        question: "Can I preview the memorial before ordering?",
        answer:
          "Yes! You can see exactly how your memorial will look before completing your purchase. You can make changes and adjustments until you're completely satisfied with how it appears.",
      },
      {
        question: "How long does it take to set up?",
        answer:
          "Most people complete their memorial in 15-20 minutes. You can work at your own pace and save your progress. Once submitted, the digital memorial can go live while the selected product is prepared for print-on-demand fulfillment.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    faqs: [
      {
        question: "Are there any monthly fees?",
        answer:
          "Physical products are one-time purchases. Digital memorial hosting is billed separately at $4.99 per month per memorial.",
      },
      {
        question: "What's included in the product price?",
        answer:
          "The price shown in the store covers the physical product in your cart. Digital memorial hosting is a separate $4.99 monthly charge per memorial.",
      },
      {
        question: "What happens if I cancel my hosting subscription?",
        answer:
          "You will not be charged for another billing period. The physical product remains yours, but the hosted memorial may become unavailable after the paid period ends. Contact support before canceling if you need help preserving a copy of your content.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with your memorial for any reason, contact us within 30 days for a full refund.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payments are processed securely.",
      },
    ],
  },
  {
    title: "QR Products & Fulfillment",
    faqs: [
      {
        question: "Which physical products are available?",
        answer:
          "The store offers a Keep Card sticker, cork memorial coaster, acrylic QR keyring, Voice Keychain, indoor slate desk plaque, pet QR tag, and memorial photo block.",
      },
      {
        question: "Are the products made to order?",
        answer:
          "Yes. Each product uses a unique print file containing the memorial's QR code and is fulfilled through Printful or Printify.",
      },
      {
        question: "Can I use these products as permanent outdoor cemetery markers?",
        answer:
          "No. The sticker and display products are not sold as cemetery-grade outdoor markers. Follow the intended use shown on each product listing.",
      },
      {
        question: "What if the QR code stops working?",
        answer:
          "The printed QR code does not expire, but it links to the hosted memorial and needs an active hosting plan. Contact support if an active memorial is not loading.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Production and shipping times depend on the selected product and fulfillment provider. Tracking details are sent when the order ships.",
      },
    ],
  },
  {
    title: "Digital Memorial Features",
    faqs: [
      {
        question: "Can I add more photos later?",
        answer:
          "You can log into your account anytime to add more photos, update information, or make changes to the memorial. There's no limit to the number of photos you can upload.",
      },
      {
        question: "Can visitors leave messages?",
        answer:
          "Yes! Visitors can leave condolence messages, share memories, and express their thoughts. You can moderate these messages and choose which ones to display publicly.",
      },
      {
        question: "Is the memorial private or public?",
        answer:
          "You control the privacy settings. You can make the memorial completely public, require a password, or restrict access to specific people. You can change these settings anytime.",
      },
      {
        question: "Can family members help manage the memorial?",
        answer:
          "Yes! You can invite family members to be co-administrators, allowing them to add photos, update information, and moderate messages. This makes it easy for the whole family to contribute.",
      },
      {
        question: "What happens if I forget my login information?",
        answer:
          "No problem! Use the 'Forgot Password' link on the login page, and we'll send you a reset link. If you need additional help, our support team is available 24/7.",
      },
    ],
  },
  {
    title: "Technical Support",
    faqs: [
      {
        question: "What if someone can't scan the QR code?",
        answer:
          "Most smartphones can scan QR codes with their built-in camera app. For older phones, we recommend downloading a free QR code scanner app. We also provide a short URL as a backup that people can type in manually.",
      },
      {
        question: "Do I need technical skills to create a memorial?",
        answer:
          "Not at all! Our platform is designed to be user-friendly for people of all technical skill levels. The process is guided step-by-step, and our support team is always available to help if needed.",
      },
      {
        question: "What if I need help setting up the memorial?",
        answer:
          "We offer 24/7 customer support via phone, email, and live chat. Our team can walk you through the entire process, help with technical issues, or even help you create the memorial over the phone if needed.",
      },
      {
        question: "Can I transfer ownership of the memorial?",
        answer:
          "Yes! Memorial ownership can be transferred to another family member if needed. Contact our support team, and we'll help you transfer the account securely.",
      },
    ],
  },
  {
    title: "Using Your Memorial QR Code",
    faqs: [
      {
        question: "What does the printed QR code open?",
        answer:
          "It opens the linked digital memorial website with photos, videos, life stories, and guest messages.",
      },
      {
        question: "Does every physical product use a unique QR code?",
        answer:
          "Yes. A custom print file is generated for the memorial associated with the order.",
      },
      {
        question: "Can family members scan it without an app?",
        answer:
          "Yes. Most current smartphone camera apps recognize QR codes without a separate app.",
      },
      {
        question: "Can I order more than one product for the same memorial?",
        answer:
          "Yes. Multiple products can link to the same digital memorial, and the site charges one hosting fee per memorial rather than per physical product.",
      },
      {
        question: "Can I update the memorial after the product is printed?",
        answer:
          "Yes. The QR destination stays the same while authorized family members update the hosted memorial content.",
      },
    ],
  },
]

export default function FAQPage() {
  const allFaqs = faqCategories.flatMap((category) => category.faqs)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={faqSchema} />
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-lg">
            <HelpCircle className="w-4 h-4 mr-2" />
            Get Answers
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions about creating digital memorials, personalized QR products, pricing, and
            more. Can't find what you're looking for? Contact our support team for help.
          </p>

          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-orange-200">
                  {category.title}
                </h2>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border border-gray-200 rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-orange-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed pt-2 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
            <p className="text-xl text-gray-600 mb-12">
              Our support team can help you create a memorial for your loved one.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <CardContent className="p-8 text-center">
                  <Phone className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-4">Speak with a real person who can help you through the process.</p>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link href="tel:256-595-3354">Call 256-595-3354</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <CardContent className="p-8 text-center">
                  <Mail className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-4">Send us your questions and we'll respond as soon as we can.</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    <Link href="mailto:support@memorialsQR.com">Email Us</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Help Center</h3>
                  <p className="text-gray-600 mb-4">Browse our comprehensive help articles and guides.</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent"
                  >
                    <Link href="/help">Visit Help Center</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Their Memorial?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start honoring your loved one today with a beautiful digital memorial that will preserve their memory
            forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-xl font-bold"
            >
              <Link href="/store">Shop Memorial Products</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent"
            >
              <Link href="/browse-memorials">View Sample Memorials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-gray-400 text-sm">Honoring memories with digital memorials that last forever.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <ul className="space-y-2 text-sm text-gray-400">
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
              <ul className="space-y-2 text-sm text-gray-400">
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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
