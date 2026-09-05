"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type MemorialDetails = {
  id: string
  full_name: string
  birth_date: string | null
  death_date: string | null
  location: string | null
  biography: string | null
}

type FamilyMember = { name: string; relationship: string }
type ExternalLink = { label: string; url: string }

export function MemorialDetailsForm({
  memorial,
  familyMembers,
  externalLinks,
}: {
  memorial: MemorialDetails
  familyMembers: FamilyMember[]
  externalLinks: ExternalLink[]
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fullName: memorial.full_name,
    birthDate: memorial.birth_date || "",
    deathDate: memorial.death_date || "",
    location: memorial.location || "",
    biography: memorial.biography || "",
    familyMembers: familyMembers.map((item) => `${item.relationship} | ${item.name}`).join("\n"),
    externalLinks: externalLinks.map((item) => `${item.label} | ${item.url}`).join("\n"),
  })

  const parsePairs = (value: string, firstKey: string, secondKey: string) =>
    value
      .split("\n")
      .map((line) => line.split("|").map((part) => part.trim()))
      .filter(([first, second]) => first && second)
      .map(([first, second]) => ({ [firstKey]: first, [secondKey]: second }))

  const save = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/memorials/${memorial.id}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          familyMembers: parsePairs(form.familyMembers, "relationship", "name"),
          externalLinks: parsePairs(form.externalLinks, "label", "url"),
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Update failed")
      toast({ title: "Memorial updated", description: "Your public memorial now shows these details." })
      router.refresh()
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Life information, family and links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="birthDate">Date of birth</Label>
            <Input
              id="birthDate"
              type="date"
              value={form.birthDate}
              onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="deathDate">Date of passing</Label>
            <Input
              id="deathDate"
              type="date"
              value={form.deathDate}
              onChange={(event) => setForm({ ...form, deathDate: event.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="biography">Biography / obituary</Label>
          <Textarea
            id="biography"
            rows={7}
            value={form.biography}
            onChange={(event) => setForm({ ...form, biography: event.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="familyMembers">Family tree</Label>
          <Textarea
            id="familyMembers"
            rows={5}
            value={form.familyMembers}
            onChange={(event) => setForm({ ...form, familyMembers: event.target.value })}
            placeholder={"Mother | Jane Smith\nChild | Alex Smith"}
          />
          <p className="mt-1 text-xs text-muted-foreground">One per line: relationship | name</p>
        </div>
        <div>
          <Label htmlFor="externalLinks">External links</Label>
          <Textarea
            id="externalLinks"
            rows={4}
            value={form.externalLinks}
            onChange={(event) => setForm({ ...form, externalLinks: event.target.value })}
            placeholder={"Online obituary | https://example.com\nCharity | https://example.org"}
          />
          <p className="mt-1 text-xs text-muted-foreground">One per line: label | URL</p>
        </div>
        <Button onClick={save} disabled={saving || !form.fullName.trim()}>
          {saving ? "Saving..." : "Save memorial details"}
        </Button>
      </CardContent>
    </Card>
  )
}
