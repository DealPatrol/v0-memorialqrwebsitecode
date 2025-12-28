"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, CheckCircle } from "lucide-react"

interface PremiumProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubscribe: (paymentMethod: string) => void
}

export function PremiumProfileDialog({ open, onOpenChange, onSubscribe }: PremiumProfileDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      onSubscribe(paymentMethod)
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Premium Family Profile</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Premium Profile Benefits</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Add photos and images</li>
                  <li>• Write detailed biographies</li>
                  <li>• Include personal stories</li>
                  <li>• Link to other family members</li>
                  <li>• Add important life events</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold">
              $2.99<span className="text-sm text-gray-500">/month</span>
            </p>
            <p className="text-sm text-gray-500">Cancel anytime</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically
              renew each month until canceled.
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Subscribe - $2.99/month"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
