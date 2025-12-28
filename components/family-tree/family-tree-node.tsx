"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, User } from "lucide-react"
import type { FamilyMemberWithChildren } from "@/types/supabase"

interface FamilyTreeNodeProps {
  member: FamilyMemberWithChildren
  level: number
  onViewDetails: (member: FamilyMemberWithChildren) => void
}

export function FamilyTreeNode({ member, level, onViewDetails }: FamilyTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = member.children && member.children.length > 0

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const birthYear = member.birth_date ? new Date(member.birth_date).getFullYear() : null
  const deathYear = member.death_date ? new Date(member.death_date).getFullYear() : null
  const yearsText =
    birthYear && deathYear
      ? `${birthYear} - ${deathYear}`
      : birthYear || deathYear
        ? `b. ${birthYear || "?"} ${deathYear ? `d. ${deathYear}` : ""}`
        : ""

  return (
    <div className="relative">
      <div className="flex items-start mb-2">
        {/* Connector lines for levels > 0 */}
        {level > 0 && <div className="absolute -left-8 top-1/2 w-8 h-px bg-gray-300"></div>}

        {/* Expand/collapse button for nodes with children */}
        {hasChildren && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mr-1 rounded-full" onClick={toggleExpand}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}

        {/* Member card */}
        <Card className="w-64 hover:shadow-md transition-shadow">
          <CardContent className="p-3 flex items-center space-x-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              {member.image_url ? (
                <Image src={member.image_url || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-medium text-sm truncate">{member.name}</h4>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">{member.relationship}</p>
                {yearsText && <p className="text-xs text-gray-500">{yearsText}</p>}
              </div>
            </div>
          </CardContent>
          <div className="px-3 pb-3">
            <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => onViewDetails(member)}>
              View Details
            </Button>
          </div>
        </Card>
      </div>

      {/* Children nodes */}
      {hasChildren && isExpanded && (
        <div className="pl-8 border-l border-gray-300 ml-3">
          {member.children?.map((child) => (
            <FamilyTreeNode key={child.id} member={child} level={level + 1} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  )
}
