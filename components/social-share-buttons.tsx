"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Facebook, Twitter, Linkedin, Mail, LinkIcon, MessageCircle } from "lucide-react"

interface SocialShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function SocialShareButtons({ url, title, description, className = "" }: SocialShareButtonsProps) {
  const { toast } = useToast()

  const shareText = description || `Visit this memorial page for ${title}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(shareText)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link Copied",
        description: "Memorial link has been copied to your clipboard.",
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: "hover:bg-green-600 hover:text-white",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: "hover:bg-gray-600 hover:text-white",
    },
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="sm"
          className={`transition-colors ${link.color}`}
          onClick={() => window.open(link.url, "_blank", "noopener,noreferrer,width=600,height=400")}
        >
          <link.icon className="w-4 h-4 mr-2" />
          {link.name}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="hover:bg-purple-600 hover:text-white bg-transparent"
        onClick={handleCopyLink}
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Copy Link
      </Button>
    </div>
  )
}
