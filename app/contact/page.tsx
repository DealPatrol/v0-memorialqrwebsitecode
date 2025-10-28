"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 2 hours.",
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-chart-2 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting us. We'll get back to you within 2 hours during business hours.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-accent to-accent/50">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-lg">
            <MessageCircle className="w-4 h-4 mr-2" />
            We're Here to Help
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Our Support Team</h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Have questions about creating a memorial? Need technical support? Our friendly team is available 24/7 to
            help you honor your loved one with a beautiful digital tribute.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors text-center">
              <CardContent className="p-8">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">Speak with a real person who understands your needs</p>
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">1-800-MEMORIAL</div>
                  <div className="text-sm text-muted-foreground">Available 24/7</div>
                </div>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                  <Link href="tel:1-800-MEMORIAL">Call Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors text-center">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">Send us your questions and get detailed responses</p>
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">support@memorialqr.com</div>
                  <div className="text-sm text-muted-foreground">Response within 2 hours</div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 border-primary text-primary hover:bg-primary/10 bg-transparent"
                >
                  <Link href="mailto:support@memorialqr.com">Send Email</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors text-center">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">Get instant answers to your questions</p>
                <div className="space-y-2">
                  <div className="font-semibold text-foreground">Available Now</div>
                  <div className="text-sm text-muted-foreground">Average response: 30 seconds</div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 border-primary text-primary hover:bg-primary/10 bg-transparent"
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Send Us a Message</CardTitle>
                <p className="text-center text-muted-foreground">
                  Fill out the form below and we'll get back to you within 2 hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="subject">How can we help? *</Label>
                    <Select name="subject" required>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Questions</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payment</SelectItem>
                        <SelectItem value="memorial">Memorial Creation Help</SelectItem>
                        <SelectItem value="plaque">QR Code Plaque Issues</SelectItem>
                        <SelectItem value="refund">Refund Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="mt-1"
                      placeholder="Please describe your question or issue in detail..."
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Hours & Location */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Commitment to You</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Support Hours</h3>
                  <div className="space-y-2 text-foreground">
                    <div className="flex justify-between">
                      <span>Phone Support:</span>
                      <span className="font-semibold">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email Support:</span>
                      <span className="font-semibold">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Chat:</span>
                      <span className="font-semibold">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-semibold text-primary">Within 2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <MapPin className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Company Information</h3>
                  <div className="space-y-2 text-foreground">
                    <div>
                      <div className="font-semibold">Memorial QR LLC</div>
                      <div>123 Memory Lane</div>
                      <div>Springfield, IL 62701</div>
                    </div>
                    <div className="pt-2">
                      <div className="font-semibold">Business License:</div>
                      <div className="text-sm">#MEM-2024-001</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <h3 className="text-2xl font-semibold text-foreground mb-4">We're Here for You</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Creating a memorial for a loved one is deeply personal. Our compassionate support team understands the
                importance of honoring their memory perfectly. We're here to help every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Their Memorial?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start honoring your loved one today. Our team is standing by to help you create a beautiful tribute.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-xl font-bold"
            >
              <Link href="/create-profile">Create Memorial - $119.99</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg bg-transparent"
            >
              <Link href="/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Memorial QR</h3>
              <p className="text-muted-foreground text-sm">
                Honoring memories with digital memorials that last forever.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/how-it-works" className="hover:text-card-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-card-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/browse-memorials" className="hover:text-card-foreground">
                    Sample Memorials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-card-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-card-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-card-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-card-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-card-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Memorial QR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
