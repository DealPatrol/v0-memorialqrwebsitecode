"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

export interface Theme {
  id: string
  name: string
  description: string
  previewGradient: string
  colors: {
    background: string
    card: string
    text: string
    accent: string
  }
}

export const themes: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Timeless elegance with soft, traditional styling",
    previewGradient: "from-slate-100 to-purple-100",
    colors: {
      background: "bg-gradient-to-br from-slate-50 to-purple-100",
      card: "bg-white",
      text: "text-slate-900",
      accent: "text-purple-600",
    },
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Patriotic honor with dignified military styling",
    previewGradient: "from-blue-900 to-red-800",
    colors: {
      background: "bg-gradient-to-br from-blue-950 to-slate-800",
      card: "bg-slate-900/50 backdrop-blur-sm border-blue-800/30",
      text: "text-blue-50",
      accent: "text-red-400",
    },
  },
  {
    id: "athlete",
    name: "Athlete",
    description: "Dynamic energy with bold, active styling",
    previewGradient: "from-green-700 to-emerald-900",
    colors: {
      background: "bg-gradient-to-br from-green-800 to-emerald-950",
      card: "bg-green-900/40 backdrop-blur-sm border-green-600/30",
      text: "text-green-50",
      accent: "text-yellow-400",
    },
  },
  {
    id: "artist",
    name: "Artist",
    description: "Creative expression with vibrant, artistic styling",
    previewGradient: "from-purple-600 to-pink-500",
    colors: {
      background: "bg-gradient-to-br from-purple-900 to-pink-800",
      card: "bg-purple-900/40 backdrop-blur-sm border-purple-500/30",
      text: "text-purple-50",
      accent: "text-pink-300",
    },
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Refined wisdom with classic academic styling",
    previewGradient: "from-amber-800 to-stone-900",
    colors: {
      background: "bg-gradient-to-br from-amber-900 to-stone-900",
      card: "bg-amber-950/50 backdrop-blur-sm border-amber-700/30",
      text: "text-amber-50",
      accent: "text-amber-300",
    },
  },
  {
    id: "gardener",
    name: "Gardener",
    description: "Nature's peace with organic, earthy styling",
    previewGradient: "from-teal-700 to-lime-800",
    colors: {
      background: "bg-gradient-to-br from-teal-900 to-green-900",
      card: "bg-teal-950/40 backdrop-blur-sm border-teal-600/30",
      text: "text-teal-50",
      accent: "text-lime-300",
    },
  },
]

interface ThemeSelectorProps {
  value: string
  onChange: (themeId: string) => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(value || "classic")

  const handleSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    onChange(themeId)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`
              relative cursor-pointer transition-all p-4 hover:scale-105
              ${selectedTheme === theme.id ? "ring-2 ring-purple-600 ring-offset-2" : "hover:shadow-lg"}
            `}
            onClick={() => handleSelect(theme.id)}
          >
            {selectedTheme === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Theme preview */}
            <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.previewGradient} mb-3`} />

            <div>
              <h4 className="font-semibold text-sm mb-1">{theme.name}</h4>
              <p className="text-xs text-slate-600 leading-tight">{theme.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Preview:</strong> The selected theme will style the memorial page with matching colors and
          backgrounds.
        </p>
      </div>
    </div>
  )
}
