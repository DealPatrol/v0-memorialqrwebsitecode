"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getAllOrders, updateOrderStatus } from "@/app/actions/orders"
import { createMemorialFromOrder } from "@/app/actions/memorial"
import { Package, Mail, Phone, MapPin, Calendar, DollarSign, Search, Filter, ExternalLink, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  created_at: string
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address_line1: string
  shipping_address_line2: string | null
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  amount_cents: number
  product_name: string
  payment_status: string
  memorial_id: string | null
  admin_notes: string | null
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const [showMemorialDialog, setShowMemorialDialog] = useState(false)
  const [memorialFormData, setMemorialFormData] = useState({
    fullName: "",
    birthDate: "",
    deathDate: "",
    location: "",
    biography: "",
  })
  const [isCreatingMemorial, setIsCreatingMemorial] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    const result = await getAllOrders()
    if (result.success) {
      setOrders(result.orders)
    } else {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    setIsUpdating(true)
    const result = await updateOrderStatus(selectedOrder.id, newStatus, adminNotes || undefined)

    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Order ${selectedOrder.order_number} has been updated to ${newStatus}`,
      })
      fetchOrders()
      setSelectedOrder(null)
      setNewStatus("")
      setAdminNotes("")
    } else {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
    setIsUpdating(false)
  }

  const handleCreateMemorial = async () => {
    if (!selectedOrder) return

    if (!memorialFormData.fullName || !memorialFormData.birthDate || !memorialFormData.deathDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreatingMemorial(true)

    const result = await createMemorialFromOrder(selectedOrder.id, memorialFormData)

    if (result.success) {
      toast({
        title: "Memorial Created!",
        description: `Memorial has been created and linked to order ${selectedOrder.order_number}`,
      })
      fetchOrders()
      setShowMemorialDialog(false)
      setMemorialFormData({
        fullName: "",
        birthDate: "",
        deathDate: "",
        location: "",
        biography: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create memorial",
        variant: "destructive",
      })
    }

    setIsCreatingMemorial(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Processing</p>
                    <p className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{orders.filter((o) => o.status === "completed").length}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ${(orders.reduce((sum, o) => sum + o.amount_cents, 0) / 100).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by order number, customer name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders found</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">Customer Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{order.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{order.customer_email}</span>
                            </div>
                            {order.customer_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{order.customer_phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">Shipping Address</h4>
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p>{order.shipping_address_line1}</p>
                              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                              <p>
                                {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">Order Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Product:</span>
                              <span className="font-medium">{order.product_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-bold text-lg">${(order.amount_cents / 100).toFixed(2)}</span>
                            </div>
                            {order.memorial_id ? (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Memorial:</span>
                                <Link href={`/memorial/${order.memorial_id}`}>
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    View Memorial <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                </Link>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Memorial:</span>
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  Not Created
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {order.admin_notes && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-600 mb-2">Admin Notes</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{order.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                      {!order.memorial_id && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowMemorialDialog(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Memorial
                        </Button>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setSelectedOrder(order)
                              setNewStatus(order.status)
                              setAdminNotes(order.admin_notes || "")
                            }}
                          >
                            Update Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Order Status</DialogTitle>
                            <DialogDescription>
                              Update the status and add notes for {order.order_number}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="status">Order Status</Label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger id="status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes">Admin Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add notes about this order..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                              {isUpdating ? "Updating..." : "Update Order"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <Dialog open={showMemorialDialog} onOpenChange={setShowMemorialDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Memorial</DialogTitle>
            <DialogDescription>Create a digital memorial for order {selectedOrder?.order_number}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={memorialFormData.fullName}
                onChange={(e) => setMemorialFormData({ ...memorialFormData, fullName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={memorialFormData.birthDate}
                  onChange={(e) => setMemorialFormData({ ...memorialFormData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deathDate">Death Date *</Label>
                <Input
                  id="deathDate"
                  type="date"
                  value={memorialFormData.deathDate}
                  onChange={(e) => setMemorialFormData({ ...memorialFormData, deathDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={memorialFormData.location}
                onChange={(e) => setMemorialFormData({ ...memorialFormData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                placeholder="Write a brief biography..."
                value={memorialFormData.biography}
                onChange={(e) => setMemorialFormData({ ...memorialFormData, biography: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMemorialDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMemorial} disabled={isCreatingMemorial}>
              {isCreatingMemorial ? "Creating..." : "Create Memorial"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
