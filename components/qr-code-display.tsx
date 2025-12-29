"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, QrCodeIcon } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface QRCodeDisplayProps {
  memorialId: string
  memorialUrl: string
  qrCodeUrl?: string
  memorialName: string
}

export function QRCodeDisplay({ memorialId, memorialUrl, qrCodeUrl, memorialName }: QRCodeDisplayProps) {
  const [loading, setLoading] = useState(false)
  const [generatedQrUrl, setGeneratedQrUrl] = useState(qrCodeUrl)
  const { toast } = useToast()

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/qr-code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId, memorialUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedQrUrl(data.qrCodeUrl)
        toast({
          title: "QR Code Generated",
          description: "Your QR code has been created successfully.",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/qr-code/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialUrl,
          fileName: `${memorialName.replace(/\s+/g, "-").toLowerCase()}-qr-code`,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${memorialName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Downloaded",
        description: "QR code has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" />
          Memorial QR Code
        </CardTitle>
        <CardDescription>Scan this code to visit the memorial page</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedQrUrl ? (
          <>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <Image
                src={generatedQrUrl || "/placeholder.svg"}
                alt="Memorial QR Code"
                width={300}
                height={300}
                className="rounded"
              />
            </div>
            <Button onClick={handleDownload} className="w-full bg-transparent" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <QrCodeIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">Generate a QR code for this memorial</p>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate QR Code"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
