"use client"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export interface Theme {
  id: string
  name: string
  description: string
  previewBg: string
  backgroundImage: string
  primaryColor: string
  textColor: string
}

export const MEMORIAL_THEMES: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Timeless elegance with traditional styling",
    previewBg: "bg-gradient-to-br from-slate-100 to-slate-200",
    backgroundImage: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
    primaryColor: "text-slate-900",
    textColor: "text-slate-700",
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Honoring those who served with patriotic dignity",
    previewBg: "bg-gradient-to-br from-blue-900 to-red-900",
    backgroundImage: "bg-gradient-to-br from-blue-950 via-slate-900 to-red-950",
    primaryColor: "text-white",
    textColor: "text-blue-100",
  },
  {
    id: "athlete",
    name: "Athlete",
    description: "Celebrating an active life and competitive spirit",
    previewBg: "bg-gradient-to-br from-green-700 to-emerald-900",
    backgroundImage: "bg-gradient-to-br from-green-800 via-emerald-900 to-teal-950",
    primaryColor: "text-amber-300",
    textColor: "text-green-100",
  },
  {
    id: "artist",
    name: "Artist",
    description: "Expressing creativity and vibrant personality",
    previewBg: "bg-gradient-to-br from-purple-400 to-pink-500",
    backgroundImage: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    primaryColor: "text-white",
    textColor: "text-purple-50",
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Refined and intellectual with classic sophistication",
    previewBg: "bg-gradient-to-br from-amber-100 to-orange-200",
    backgroundImage: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-100",
    primaryColor: "text-amber-900",
    textColor: "text-orange-800",
  },
  {
    id: "gardener",
    name: "Gardener",
    description: "Nature-inspired serenity and peaceful growth",
    previewBg: "bg-gradient-to-br from-green-300 to-teal-400",
    backgroundImage: "bg-gradient-to-br from-green-100 via-emerald-200 to-teal-300",
    primaryColor: "text-green-900",
    textColor: "text-green-800",
  },
]

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeSelect: (themeId: string) => void
}

export function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Memorial Theme</h2>
        <p className="text-gray-600">Select a theme that best represents your loved one's personality</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MEMORIAL_THEMES.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              selectedTheme === theme.id ? "ring-4 ring-purple-500 shadow-xl" : "hover:ring-2 hover:ring-purple-300"
            }`}
            onClick={() => onThemeSelect(theme.id)}
          >
            <CardContent className="p-0">
              {/* Theme Preview */}
              <div className={`h-32 ${theme.previewBg} rounded-t-lg relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`text-center ${theme.primaryColor === "text-white" ? "text-white" : "text-gray-900"}`}
                  >
                    <div className="text-sm font-semibold">Memorial Preview</div>
                    <div className="text-xs opacity-75 mt-1">{theme.name} Theme</div>
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
