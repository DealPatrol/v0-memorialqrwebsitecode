import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Calendar, Search } from "lucide-react"

export default function OrdersPage() {
  // Sample orders data - in a real app, this would come from your database
  const orders = [
    {
      id: "ORD123456",
      date: "April 15, 2023",
      status: "Delivered",
      trackingNumber: "TRK9876543",
      items: [
        {
          name: "Premium Memorial QR",
          quantity: 1,
          price: 49.99,
        },
      ],
      total: 54.98,
      shippingAddress: "123 Main St, New York, NY 10001",
      deliveryDate: "April 22, 2023",
    },
    {
      id: "ORD789012",
      date: "May 3, 2023",
      status: "Shipped",
      trackingNumber: "TRK6543210",
      items: [
        {
          name: "Legacy Memorial QR",
          quantity: 2,
          price: 79.98,
        },
      ],
      total: 84.97,
      shippingAddress: "456 Oak Ave, Chicago, IL 60007",
      deliveryDate: "May 10, 2023",
    },
    {
      id: "ORD345678",
      date: "May 18, 2023",
      status: "Processing",
      items: [
        {
          name: "Essential Memorial QR",
          quantity: 1,
          price: 29.99,
        },
      ],
      total: 34.98,
      shippingAddress: "789 Pine St, Los Angeles, CA 90001",
      estimatedDelivery: "May 25-27, 2023",
    },
  ]

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-serif flex items-center">
              Memorial QR
              <span className="text-yellow-400 ml-1">★</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/dashboard/memorials" className="text-gray-600 hover:text-gray-900">
                My Memorials
              </Link>
              <Link href="/dashboard/orders" className="text-gray-900 font-medium">
                Orders
              </Link>
              <Link href="/dashboard/account" className="text-gray-600 hover:text-gray-900">
                Account
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-1">Your Orders</h1>
            <p className="text-gray-600">Track and manage your Memorial QR orders</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link href="/checkout">Order New QR Code</Link>
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date}</CardDescription>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.trackingNumber && (
                      <Button variant="ghost" size="sm" className="ml-2" asChild>
                        <Link href={`/tracking/${order.trackingNumber}`}>
                          <Search className="h-4 w-4 mr-1" />
                          Track
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-2">ORDER DETAILS</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex items-center">
                            <div className="relative h-12 w-12 rounded-md overflow-hidden mr-3">
                              <Image
                                src="/images/qr-code-gravestone.png"
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="pt-2 border-t mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-2">SHIPPING ADDRESS</h3>
                    <p className="text-gray-900">{order.shippingAddress}</p>
                    <div className="mt-4">
                      <h3 className="font-medium text-sm text-gray-500 mb-2">DELIVERY INFORMATION</h3>
                      <div className="flex items-start">
                        <Truck className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <p className="text-gray-900">
                          {order.status === "Delivered"
                            ? `Delivered on ${order.deliveryDate}`
                            : order.status === "Shipped"
                              ? `Expected delivery by ${order.deliveryDate}`
                              : `Estimated delivery: ${order.estimatedDelivery}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-2">ACTIONS</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Package className="h-4 w-4 mr-2" />
                          View Order Details
                        </Link>
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Set Up Memorial
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Memorial QR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
