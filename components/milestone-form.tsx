"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface MilestoneFormProps {
  memorialId: string
  onSuccess: () => void
}

export function MilestoneForm({ memorialId, onSuccess }: MilestoneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    formData.append("memorialId", memorialId)

    try {
      const response = await fetch("/api/milestones", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add milestone")
      }

      onSuccess()
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add milestone")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Milestone Title</Label>
          <Input id="title" name="title" placeholder="e.g., Graduated from Harvard" required />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue="other">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birth">Birth</SelectItem>
              <SelectItem value="marriage">Marriage</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="military">Military Service</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="career">Career</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Share more details about this milestone..."
            rows={3}
          />
        </div>

        {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Adding..." : "Add Milestone"}
        </Button>
      </form>
    </Card>
  )
}
