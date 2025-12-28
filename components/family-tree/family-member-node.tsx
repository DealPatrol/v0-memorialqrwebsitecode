"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Star, Edit } from "lucide-react"
import type { FamilyMemberWithChildren } from "@/types/supabase"

interface FamilyMemberNodeProps {
  member: FamilyMemberWithChildren
  isExpanded: boolean
  onToggleExpand: () => void
  onViewDetails: (member: FamilyMemberWithChildren) => void
  onEdit?: (member: FamilyMemberWithChildren) => void
  expandedNodes: Record<string, boolean>
  level?: number
}

export function FamilyMemberNode({
  member,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onEdit,
  expandedNodes,
  level = 0,
}: FamilyMemberNodeProps) {
  const hasChildren = member.children && member.children.length > 0
  const isPremium = member.is_premium

  return (
    <div className="family-node">
      <div
        className={`flex items-center p-2 rounded-md mb-1 ${level > 0 ? "ml-8" : ""} hover:bg-gray-100`}
        style={{ marginLeft: `${level * 2}rem` }}
      >
        {hasChildren && (
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 mr-2" onClick={onToggleExpand}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        {!hasChildren && <div className="w-6 mr-2" />}

        <div className="flex-grow flex items-center cursor-pointer" onClick={() => onViewDetails(member)}>
          {member.image_url && isPremium ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-3 relative">
              <img
                src={member.image_url || "/placeholder.svg"}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {member.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center">
              <span className="font-medium">{member.name}</span>
              {isPremium && <Star className="h-3 w-3 text-yellow-400 ml-1" fill="currentColor" />}
            </div>
            <div className="text-xs text-gray-500">
              {member.relationship}
              {member.birth_date && !member.death_date && ` • Born ${new Date(member.birth_date).getFullYear()}`}
              {member.birth_date &&
                member.death_date &&
                ` • ${new Date(member.birth_date).getFullYear()} - ${new Date(member.death_date).getFullYear()}`}
            </div>
          </div>
        </div>

        {onEdit && (
          <Button variant="ghost" size="sm" className="ml-2" onClick={() => onEdit(member)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="pl-4">
          {member.children?.map((child) => (
            <FamilyMemberNode
              key={child.id}
              member={child}
              isExpanded={!!expandedNodes[child.id]}
              onToggleExpand={() => onToggleExpand()}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              expandedNodes={expandedNodes}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
