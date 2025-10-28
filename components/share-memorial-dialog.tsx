"use client"

import { useState } from "react"
import { Share2, Copy, Mail, Check, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SocialShareButtons } from "@/components/social-share-buttons"
import QRCode from "qrcode"

interface ShareMemorialDialogProps {
  memorialId: string
  memorialName: string
}

export function ShareMemorialDialog({ memorialId, memorialName }: ShareMemorialDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)
  const { toast } = useToast()

  const memorialUrl = typeof window !== "undefined" ? `${window.location.origin}/memorial/${memorialId}` : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl)
      setCopied(true)
      toast({
        title: "Link Copied",
        description: "Memorial link has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = async () => {
    if (!emailAddress.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setSendingEmail(true)
    try {
      const response = await fetch("/api/share/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialId,
          memorialName,
          memorialUrl,
          recipientEmail: emailAddress,
        }),
      })

      if (response.ok) {
        setEmailSent(true)
        setEmailAddress("")
        toast({
          title: "Email Sent",
          description: "Memorial link has been sent via email",
        })
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  const handleDownloadQR = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(memorialUrl, {
        width: 800,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      const link = document.createElement("a")
      link.href = qrCodeDataUrl
      link.download = `${memorialName.replace(/\s+/g, "-")}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "QR Code Downloaded",
        description: "QR code has been saved to your device",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share Memorial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Memorial</DialogTitle>
          <DialogDescription>Share this memorial with family and friends</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Memorial Link</Label>
            <div className="flex gap-2">
              <Input value={memorialUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" size="icon">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Share via Social Media</Label>
            <SocialShareButtons
              url={memorialUrl}
              title={`Memorial for ${memorialName}`}
              description={`Visit this memorial page to honor and remember ${memorialName}`}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="emailAddress">Send via Email</Label>
            <div className="flex gap-2">
              <Input
                id="emailAddress"
                type="email"
                placeholder="friend@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                disabled={sendingEmail}
              />
              <Button onClick={handleSendEmail} disabled={sendingEmail} variant="outline">
                {sendingEmail ? (
                  "Sending..."
                ) : emailSent ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button onClick={handleDownloadQR} variant="outline" className="w-full bg-transparent">
              <QrCode className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
