"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // In a real implementation, you would send this data to your server
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif flex items-center">
            Memorial QR
            <span className="text-yellow-400 ml-1">★</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-serif mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our memorial QR codes? We're here to help. Fill out the form below and we'll get back
              to you as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll respond within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We've received your message and will get back to you shortly.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="How can we help you?"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Please provide details about your inquiry..."
                          rows={5}
                          required
                        />
                      </div>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a href="mailto:colecollins763@gmail.com" className="text-blue-600 hover:underline">
                        colecollins763@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <a href="tel:+12565953354" className="text-blue-600 hover:underline">
                        (256) 595-3354
                      </a>
                      <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm CST</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <address className="not-italic text-gray-600">
                        Memorial QR
                        <br />
                        12476 CR 747
                        <br />
                        Hanceville, AL 35077
                      </address>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full bg-gray-100 rounded-md p-4 text-center">
                    <p className="text-sm text-gray-600">
                      For urgent matters, please call us directly at (256) 595-3354.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-serif mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "How long does shipping take?",
                  answer:
                    "Standard shipping takes 5-7 business days. Express shipping options are available at checkout for 2-3 business day delivery.",
                },
                {
                  question: "Are the QR codes weather resistant?",
                  answer:
                    "Yes, our QR codes are made with weather-resistant materials designed to withstand outdoor conditions for years. They're UV-resistant, waterproof, and can handle temperature extremes.",
                },
                {
                  question: "How do I set up my memorial page?",
                  answer:
                    "After purchasing, you'll receive instructions to create your account. From your dashboard, you can easily upload photos, videos, and stories to create your memorial page.",
                },
                {
                  question: "Can I upgrade my plan later?",
                  answer:
                    "Yes, you can upgrade from Essential to Premium or Legacy at any time. You'll only pay the difference between your current plan and the new plan.",
                },
              ].map((faq, i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy-policy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
