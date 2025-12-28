"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import type { FamilyMember } from "@/types/supabase"

interface FamilyMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: FamilyMember | null
  onSave: (data: Partial<FamilyMember>) => void
  onUpgrade?: (memberId: string | null) => void
}

export function FamilyMemberDialog({ open, onOpenChange, member, onSave, onUpgrade }: FamilyMemberDialogProps) {
  const [name, setName] = useState("")
  const [relationship, setRelationship] = useState("")
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [deathDate, setDeathDate] = useState<Date | null>(null)
  const [bio, setBio] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Reset form when member changes
  useEffect(() => {
    if (member) {
      setName(member.name)
      setRelationship(member.relationship)
      setBirthDate(member.birth_date ? new Date(member.birth_date) : null)
      setDeathDate(member.death_date ? new Date(member.death_date) : null)
      setBio(member.bio || "")
      setImageUrl(member.image_url || "")
      setIsPremium(member.is_premium || false)
    } else {
      setName("")
      setRelationship("")
      setBirthDate(null)
      setDeathDate(null)
      setBio("")
      setImageUrl("")
      setIsPremium(false)
    }
  }, [member, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      name,
      relationship,
      birth_date: birthDate ? format(birthDate, "yyyy-MM-dd") : null,
      death_date: deathDate ? format(deathDate, "yyyy-MM-dd") : null,
      bio: isPremium ? bio : null,
      image_url: isPremium ? imageUrl : null,
      is_premium: isPremium,
    })
  }

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade(member?.id || null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Family Member" : "Add Family Member"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info (Free)</TabsTrigger>
            <TabsTrigger value="premium" disabled={!isPremium}>
              Detailed Profile ($2.99/mo)
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <TabsContent value="basic">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Father, Mother, Sibling"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Birth Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate ? format(birthDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={birthDate || undefined}
                          onSelect={setBirthDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Death Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deathDate ? format(deathDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deathDate || undefined}
                          onSelect={setDeathDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Premium Profile</h4>
                      <p className="text-sm text-gray-500">Add photos, bio, and more for $2.99/month</p>
                    </div>
                    <Switch
                      checked={isPremium}
                      onCheckedChange={(checked) => {
                        setIsPremium(checked)
                        if (checked) {
                          setActiveTab("premium")
                        }
                      }}
                    />
                  </div>

                  {!isPremium && (
                    <div className="mt-4">
                      <Button type="button" variant="outline" className="w-full" onClick={handleUpgrade}>
                        Upgrade to Premium Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="premium">
              {isPremium ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Profile Photo</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Enter a short biography"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Lock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Premium Profile</h3>
                  <p className="text-gray-500 mb-4">
                    Upgrade to add photos, biography, and more details for this family member.
                  </p>
                  <Button type="button" onClick={handleUpgrade}>
                    Upgrade for $2.99/month
                  </Button>
                </div>
              )}
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
