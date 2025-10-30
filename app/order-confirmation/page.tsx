"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Mail, Clock } from "lucide-react"
import Link from "next/link"
import { getOrderByNumber } from "@/app/actions/orders"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderNumber) {
        setLoading(false)
        return
      }

      const result = await getOrderByNumber(orderNumber)
      if (result.success) {
        setOrder(result.order)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Order Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We couldn't find your order. Please check your email for confirmation.
              </p>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been received.</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-sm text-gray-600">{order.customer_email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-semibold">{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p className="text-sm">{order.shipping_address_line2}</p>}
                <p className="text-sm">
                  {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold">{order.product_name}</p>
                <p className="text-lg font-bold">${(order.amount_cents / 100).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold mb-1">Check Your Email</h3>
                <p className="text-sm text-gray-600">A confirmation has been sent to {order.customer_email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold mb-1">Processing Time</h3>
                <p className="text-sm text-gray-600">Your memorial will be created within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Package className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold mb-1">Shipping</h3>
                <p className="text-sm text-gray-600">Your plaque will ship within 3-5 business days</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              We'll send you an email when your memorial is ready and another when your plaque ships.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
              <Link href="/help">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
