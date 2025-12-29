"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QrCode from "@/components/ui/qrcode"
import { Download, Palette, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const colorOptions = [
  { name: "Black", value: "#000000" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Forest Green", value: "#166534" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Burgundy", value: "#991b1b" },
  { name: "Gray", value: "#374151" },
  { name: "Teal", value: "#0f766e" },
  { name: "Brown", value: "#92400e" },
]

const styleOptions = [
  { name: "Standard", value: "standard", icon: "■" },
  { name: "Dots", value: "dots", icon: "●" },
  { name: "Rounded", value: "rounded", icon: "◆" },
]

export default function QrCustomizer() {
  const [url, setUrl] = useState("")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [selectedStyle, setSelectedStyle] = useState<"standard" | "dots" | "rounded">("standard")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a memorial URL first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Get the canvas element
      const canvas = document.querySelector(".qr-canvas") as HTMLCanvasElement
      if (!canvas) {
        throw new Error("QR code not generated yet")
      }

      // Create download link
      const link = document.createElement("a")
      link.download = `memorial-qr-${selectedStyle}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast({
        title: "QR Code Downloaded",
        description: "Your custom QR code has been saved successfully!",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span>Customize Your Memorial QR Code</span>
          </CardTitle>
          <p className="text-gray-600 mt-2">Create a personalized QR code that matches your memorial aesthetic</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="memorial-url" className="text-sm font-medium">
              Memorial Page URL
            </Label>
            <Input
              id="memorial-url"
              type="url"
              placeholder="https://memorialqr.com/memorial/your-loved-one"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Customization Controls */}
            <div className="space-y-6">
              {/* Color Picker */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2 text-sm font-medium">
                  <Palette className="h-4 w-4" />
                  <span>QR Code Color</span>
                </Label>
                <div className="color-picker">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`color-option ${selectedColor === color.value ? "active" : ""}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>

              {/* Style Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">QR Code Style</Label>
                <div className="style-selector">
                  {styleOptions.map((style) => (
                    <button
                      key={style.value}
                      className={`style-option ${selectedStyle === style.value ? "active" : ""}`}
                      onClick={() => setSelectedStyle(style.value as "standard" | "dots" | "rounded")}
                      title={style.name}
                      aria-label={`Select ${style.name} style`}
                    >
                      {style.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={!url || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Download QR Code"}
              </Button>
            </div>

            {/* QR Code Preview */}
            <div className="flex flex-col items-center space-y-4">
              <Label className="text-sm font-medium">Preview</Label>
              <div id="qrcode" className="flex justify-center items-center min-h-[320px] bg-gray-50 rounded-lg p-4">
                {url ? (
                  <QrCode value={url} size={300} color={selectedColor} style={selectedStyle} />
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCode value="https://memorialqr.com" size={200} color="#e5e7eb" />
                    <p className="mt-4 text-sm">Enter a URL to generate your QR code</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Usage Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• QR codes work best when printed at least 1 inch (2.5cm) square</li>
              <li>• Darker colors provide better contrast for scanning</li>
              <li>• Test your QR code with multiple devices before final printing</li>
              <li>• Standard style offers the most reliable scanning</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
