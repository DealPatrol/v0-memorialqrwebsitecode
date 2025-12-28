"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { MessageCirclePlus } from "lucide-react"

interface AddMemoryFormProps {
  memorialId: string
}

export default function AddMemoryForm({ memorialId }: AddMemoryFormProps) {
  const [authorName, setAuthorName] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorName.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memorial_id: memorialId,
          author_name: authorName,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit memory")
      }

      toast({
        title: "Memory submitted",
        description: "Your memory has been submitted for approval",
      })

      setAuthorName("")
      setContent("")
      setIsSuccess(true)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit memory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCirclePlus className="h-5 w-5" />
          Share a Memory
        </CardTitle>
      </CardHeader>
      {isSuccess ? (
        <CardContent>
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            <p className="font-medium">Thank you for your tribute</p>
            <p>
              Your memory has been submitted and will be reviewed shortly. It will appear on this page once approved.
            </p>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Your Memory or Tribute
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your memory, story, or tribute..."
                rows={4}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Memory"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
