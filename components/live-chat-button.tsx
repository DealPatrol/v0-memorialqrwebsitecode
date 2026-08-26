"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function LiveChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      setSent(true)
      setTimeout(() => {
        setIsOpen(false)
        setSent(false)
        setName("")
        setEmail("")
        setMessage("")
      }, 2000)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-xl z-50">
          <CardHeader className="bg-accent text-white rounded-t-lg">
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <p className="text-xs text-white/90">We typically respond within 2 hours</p>
          </CardHeader>
          <CardContent className="p-4">
            {sent ? (
              <div className="text-center py-8">
                <p className="text-green-600 font-semibold mb-2">Message sent!</p>
                <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="chat-name" className="text-xs">
                    Name
                  </Label>
                  <Input
                    id="chat-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chat-email" className="text-xs">
                    Email
                  </Label>
                  <Input
                    id="chat-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="chat-message" className="text-xs">
                    Message
                  </Label>
                  <Textarea
                    id="chat-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="How can we help?"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gap-2" size="sm">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
