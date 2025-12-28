"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { FamilyMember } from "@/types/supabase"

interface FamilyMemberDetailsProps {
  member: FamilyMember
  onClose: () => void
  onUpgrade?: () => void
}

export function FamilyMemberDetails({ member, onClose, onUpgrade }: FamilyMemberDetailsProps) {
  const isPremium = member.is_premium
  const formattedBirthDate = member.birth_date ? new Date(member.birth_date).toLocaleDateString() : null
  const formattedDeathDate = member.death_date ? new Date(member.death_date).toLocaleDateString() : null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {member.name}
            {isPremium && <Star className="h-4 w-4 text-yellow-400 ml-2" fill="currentColor" />}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {isPremium && member.image_url && (
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={member.image_url || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className={`${isPremium && member.image_url ? "w-full md:w-2/3" : "w-full"}`}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Relationship</h3>
                  <p>{member.relationship}</p>
                </div>

                {(formattedBirthDate || formattedDeathDate) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dates</h3>
                    <p>
                      {formattedBirthDate && `Born: ${formattedBirthDate}`}
                      {formattedBirthDate && formattedDeathDate && <br />}
                      {formattedDeathDate && `Passed: ${formattedDeathDate}`}
                    </p>
                  </div>
                )}

                {isPremium && member.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Biography</h3>
                    <p className="whitespace-pre-line">{member.bio}</p>
                  </div>
                )}

                {!isPremium && onUpgrade && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">
                        Upgrade to a premium profile to add photos, biography, and more details.
                      </p>
                      <Button variant="outline" size="sm" onClick={onUpgrade}>
                        Upgrade for $2.99/month
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
