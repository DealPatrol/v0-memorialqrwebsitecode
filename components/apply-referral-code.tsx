"use client"

import { useState } from "react"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function ApplyReferralCode() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [applying, setApplying] = useState(false)
  const { toast } = useToast()

  const handleApply = async () => {
    if (!code.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter a referral code",
        variant: "destructive",
      })
      return
    }

    setApplying(true)
    try {
      const response = await fetch("/api/referrals/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: code }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message || "Referral code applied successfully",
        })
        setOpen(false)
        setCode("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to apply referral code",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply referral code",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Gift className="w-4 h-4 mr-2" />
          Have a referral code?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Referral Code</DialogTitle>
          <DialogDescription>Enter a referral code to get 20% off your first purchase</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="referralCode">Referral Code</Label>
            <Input
              id="referralCode"
              placeholder="Enter code..."
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={applying}
              className="font-mono"
            />
          </div>
          <Button onClick={handleApply} disabled={applying} className="w-full">
            {applying ? "Applying..." : "Apply Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
