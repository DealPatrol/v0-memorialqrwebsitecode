"use client"

import { useState, useEffect } from "react"
import { X, Gift } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const popupTimestamp = localStorage.getItem("exitPopupTimestamp")
    const now = Date.now()
    const eighteenHours = 18 * 60 * 60 * 1000
    
    // Only enable if popup hasn't been shown in the last 18 hours
    const canShow = !popupTimestamp || (now - parseInt(popupTimestamp)) > eighteenHours

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && canShow) {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem("exitPopupTimestamp", now.toString())
      }
    }

    if (canShow) {
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [hasShown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("discountEmail", email)
    window.location.href = "/checkout/unified?discount=SAVE50"
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Gift className="h-8 w-8 text-accent" />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-2xl">Wait! Don't Leave Empty-Handed</DialogTitle>
          <DialogDescription className="text-base">
            Get $50 off your memorial package when you complete your order today.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exit-email">Enter your email to claim your discount</Label>
            <Input
              id="exit-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Claim My $50 Discount
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Limited time offer. Discount automatically applied at checkout.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
