"use client"

import { useState } from "react"
import { Calendar, MapPin, Award, Heart, Briefcase, GraduationCap, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Milestone {
  id: string
  title: string
  description: string
  date: string
  category: string
  image_url?: string
}

interface TimelineViewProps {
  milestones: Milestone[]
  onDelete?: (id: string) => void
  canEdit?: boolean
}

const categoryIcons: Record<string, any> = {
  birth: Heart,
  marriage: Heart,
  achievement: Award,
  military: Star,
  education: GraduationCap,
  career: Briefcase,
  family: Users,
  other: MapPin,
}

const categoryColors: Record<string, string> = {
  birth: "bg-pink-100 text-pink-700 border-pink-300",
  marriage: "bg-red-100 text-red-700 border-red-300",
  achievement: "bg-yellow-100 text-yellow-700 border-yellow-300",
  military: "bg-blue-100 text-blue-700 border-blue-300",
  education: "bg-purple-100 text-purple-700 border-purple-300",
  career: "bg-green-100 text-green-700 border-green-300",
  family: "bg-orange-100 text-orange-700 border-orange-300",
  other: "bg-gray-100 text-gray-700 border-gray-300",
}

export function TimelineView({ milestones, onDelete, canEdit = false }: TimelineViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No milestones added yet</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-8">
        {milestones.map((milestone, index) => {
          const Icon = categoryIcons[milestone.category] || MapPin
          const colorClass = categoryColors[milestone.category] || categoryColors.other
          const isExpanded = expandedId === milestone.id

          return (
            <div key={milestone.id} className="relative pl-20">
              {/* Timeline dot */}
              <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-background ${colorClass}`} />

              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(milestone.date)}</p>
                      </div>
                    </div>

                    {milestone.description && (
                      <p className="text-muted-foreground mt-3">
                        {isExpanded
                          ? milestone.description
                          : milestone.description.length > 150
                            ? `${milestone.description.substring(0, 150)}...`
                            : milestone.description}
                      </p>
                    )}

                    {milestone.description && milestone.description.length > 150 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 mt-2"
                        onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </Button>
                    )}
                  </div>

                  {canEdit && onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(milestone.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
