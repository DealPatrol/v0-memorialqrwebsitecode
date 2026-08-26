import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { CheckCircle, Package, Smartphone, Mail } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Confirmed - Memorial QR",
  description: "Thank you for your order. Your memorial plaque is on its way.",
}

export default function StoreSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
              <p className="text-slate-600 text-lg mb-8">
                Thank you for your purchase. Your memorial plaque is being prepared.
              </p>

              <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-bold text-lg mb-4">What happens next?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Check your email</h3>
                      <p className="text-slate-600 text-sm">We've sent a confirmation with your order details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Receive your plaque</h3>
                      <p className="text-slate-600 text-sm">Your plaque will arrive in 5-10 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Scan to create memorial</h3>
                      <p className="text-slate-600 text-sm">
                        Scan the QR code on your plaque to set up the digital memorial ($4.99/month).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/browse-memorials">View Sample Memorials</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
