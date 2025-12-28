"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, PlusCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { FamilyMember, FamilyMemberWithChildren } from "@/types/supabase"
import { FamilyMemberNode } from "./family-member-node"
import { FamilyMemberDetails } from "./family-member-details"
import { FamilyMemberDialog } from "./family-member-dialog"
import { PremiumProfileDialog } from "./premium-profile-dialog"

interface FamilyTreeProps {
  memorialId: string
  isEditable?: boolean
}

export function FamilyTree({ memorialId, isEditable = false }: FamilyTreeProps) {
  const { toast } = useToast()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [organizedMembers, setOrganizedMembers] = useState<FamilyMemberWithChildren[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false)
  const [upgradingMemberId, setUpgradingMemberId] = useState<string | null>(null)

  // Fetch family members
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/memorials/${memorialId}/family`)

        if (!response.ok) {
          throw new Error("Failed to fetch family members")
        }

        const data = await response.json()
        setFamilyMembers(data.familyMembers || [])

        // Initialize all nodes as expanded
        const expanded: Record<string, boolean> = {}
        data.familyMembers?.forEach((member: FamilyMember) => {
          expanded[member.id] = true
        })
        setExpandedNodes(expanded)

        // Organize the family tree
        const organized = organizeFamilyTree(data.familyMembers || [])
        setOrganizedMembers(organized)
      } catch (err) {
        setError("Failed to load family tree")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamilyMembers()
  }, [memorialId])

  // Organize flat list into hierarchical tree
  const organizeFamilyTree = (members: FamilyMember[]): FamilyMemberWithChildren[] => {
    const memberMap: Record<string, FamilyMemberWithChildren> = {}
    const rootMembers: FamilyMemberWithChildren[] = []

    // First pass: create map of all members
    members.forEach((member) => {
      memberMap[member.id] = { ...member, children: [] }
    })

    // Second pass: establish parent-child relationships
    members.forEach((member) => {
      if (member.parent_id && memberMap[member.parent_id]) {
        // Add as child to parent
        memberMap[member.parent_id].children?.push(memberMap[member.id])
      } else {
        // No parent or parent not found, add to root
        rootMembers.push(memberMap[member.id])
      }
    })

    return rootMembers
  }

  const handleViewDetails = (member: FamilyMember) => {
    setSelectedMember(member)
  }

  const toggleNodeExpanded = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddMember = () => {
    setEditingMember(null)
    setDialogOpen(true)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setDialogOpen(true)
  }

  const handleSaveMember = async (data: Partial<FamilyMember>) => {
    try {
      if (editingMember) {
        // Update existing member
        const response = await fetch(`/api/memorials/${memorialId}/family/${editingMember.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to update family member")
        }

        const updatedMember = await response.json()

        // Update local state
        setFamilyMembers((prev) =>
          prev.map((member) => (member.id === editingMember.id ? updatedMember.familyMember : member)),
        )

        toast({
          title: "Family member updated",
          description: "The family member has been updated successfully.",
        })
      } else {
        // Create new member
        const response = await fetch(`/api/memorials/${memorialId}/family`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to create family member")
        }

        const newMember = await response.json()

        // Update local state
        setFamilyMembers((prev) => [...prev, newMember.familyMember])

        toast({
          title: "Family member added",
          description: "The family member has been added successfully.",
        })
      }

      // Close dialog and refresh
      setDialogOpen(false)

      // Re-organize the tree
      const organized = organizeFamilyTree([...familyMembers, data as FamilyMember])
      setOrganizedMembers(organized)
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to save family member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpgradeMember = (memberId: string | null) => {
    setUpgradingMemberId(memberId)
    setPremiumDialogOpen(true)
    setDialogOpen(false)
  }

  const handlePremiumSubscription = async (paymentMethod: string) => {
    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful subscription

      // Update the member to premium status
      if (upgradingMemberId) {
        const response = await fetch(`/api/memorials/${memorialId}/family/${upgradingMemberId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_premium: true }),
        })

        if (!response.ok) {
          throw new Error("Failed to upgrade family member")
        }

        // Update local state
        setFamilyMembers((prev) =>
          prev.map((member) => (member.id === upgradingMemberId ? { ...member, is_premium: true } : member)),
        )

        toast({
          title: "Premium profile activated",
          description: "You can now add detailed information to this family member.",
        })
      }

      setPremiumDialogOpen(false)

      // If we were editing a member, reopen the dialog
      if (upgradingMemberId) {
        const member = familyMembers.find((m) => m.id === upgradingMemberId)
        if (member) {
          setEditingMember({ ...member, is_premium: true })
          setDialogOpen(true)
        }
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full ml-8" />
        <Skeleton className="h-24 w-full ml-16" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Tree
        </CardTitle>
        {isEditable && (
          <Button size="sm" onClick={handleAddMember}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {familyMembers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No family members have been added yet.</p>
            {isEditable && (
              <Button variant="outline" className="mt-4" onClick={handleAddMember}>
                Add First Family Member
              </Button>
            )}
          </div>
        ) : (
          <div className="family-tree">
            <div className="overflow-x-auto pb-6">
              <div className="min-w-max">
                {organizedMembers.map((member) => (
                  <FamilyMemberNode
                    key={member.id}
                    member={member}
                    isExpanded={!!expandedNodes[member.id]}
                    onToggleExpand={() => toggleNodeExpanded(member.id)}
                    onViewDetails={handleViewDetails}
                    onEdit={isEditable ? handleEditMember : undefined}
                    expandedNodes={expandedNodes}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Family member details modal */}
        {selectedMember && <FamilyMemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}

        {/* Family member edit/add dialog */}
        <FamilyMemberDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          member={editingMember}
          onSave={handleSaveMember}
          onUpgrade={handleUpgradeMember}
        />

        {/* Premium subscription dialog */}
        <PremiumProfileDialog
          open={premiumDialogOpen}
          onOpenChange={setPremiumDialogOpen}
          onSubscribe={handlePremiumSubscription}
        />
      </CardContent>
    </Card>
  )
}
