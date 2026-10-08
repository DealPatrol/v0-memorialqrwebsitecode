'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, AlertCircle, FileText, Download, Eye } from 'lucide-react'
import { EmailComposer } from './concierge-email-composer'

interface ConciergeRequest {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  deceased_name: string
  birth_date: string | null
  death_date: string | null
  obituary: string | null
  delivery_type: string
  plaque_color: string | null
  status: string
  admin_notes: string | null
  memorial_id: string | null
  digital_memorial_url: string | null
  qr_code_url: string | null
  created_at: string
}

interface AdminDashboardProps {
  initialRequests: ConciergeRequest[]
}

export function ConciergeAdminDashboard({ initialRequests }: AdminDashboardProps) {
  const [requests, setRequests] = useState<ConciergeRequest[]>(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<ConciergeRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [adminNotes, setAdminNotes] = useState<string>('')

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(req => req.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300'
      case 'completed':
        return 'bg-green-500/20 text-green-300'
      case 'delivered':
        return 'bg-purple-500/20 text-purple-300'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300'
      default:
        return 'bg-zinc-500/20 text-zinc-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/concierge/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          status: newStatus,
          adminNotes,
        }),
      })

      if (response.ok) {
        setRequests(prev =>
          prev.map(req =>
            req.id === requestId
              ? { ...req, status: newStatus, admin_notes: adminNotes }
              : req
          )
        )
        if (selectedRequest?.id === requestId) {
          setSelectedRequest(prev =>
            prev ? { ...prev, status: newStatus, admin_notes: adminNotes } : null
          )
        }
      }
    } catch (error) {
      console.error('Error updating request:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Request List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className="whitespace-nowrap"
          >
            All ({requests.length})
          </Button>
          {['pending', 'in_progress', 'completed', 'delivered', 'cancelled'].map(status => {
            const count = requests.filter(r => r.status === status).length
            return (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                className="whitespace-nowrap capitalize"
              >
                {status} ({count})
              </Button>
            )
          })}
        </div>

        {/* Request Cards */}
        <div className="space-y-3">
          {filteredRequests.map(request => (
            <Card
              key={request.id}
              className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-all ${
                selectedRequest?.id === request.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{request.deceased_name}</h3>
                    <p className="text-sm text-zinc-400">{request.customer_name}</p>
                    <p className="text-sm text-zinc-500">{request.customer_email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className={`${getStatusColor(request.status)} border-0`}>
                        <span className="mr-1">{getStatusIcon(request.status)}</span>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {request.delivery_type === 'plaque' ? `${request.plaque_color} Plaque` : 'Digital'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-zinc-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Request Details */}
      {selectedRequest && (
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">{selectedRequest.deceased_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-white mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm text-zinc-400">
                  <p><span className="text-zinc-500">Name:</span> {selectedRequest.customer_name}</p>
                  <p><span className="text-zinc-500">Email:</span> {selectedRequest.customer_email}</p>
                  {selectedRequest.customer_phone && (
                    <p><span className="text-zinc-500">Phone:</span> {selectedRequest.customer_phone}</p>
                  )}
                </div>
              </div>

              {/* Deceased Info */}
              <div>
                <h4 className="font-semibold text-white mb-2">Deceased Information</h4>
                <div className="space-y-1 text-sm text-zinc-400">
                  {selectedRequest.birth_date && (
                    <p><span className="text-zinc-500">Born:</span> {new Date(selectedRequest.birth_date).toLocaleDateString()}</p>
                  )}
                  {selectedRequest.death_date && (
                    <p><span className="text-zinc-500">Passed:</span> {new Date(selectedRequest.death_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <h4 className="font-semibold text-white mb-2">Order Details</h4>
                <div className="space-y-1 text-sm text-zinc-400">
                  <p><span className="text-zinc-500">Type:</span> {selectedRequest.delivery_type === 'plaque' ? 'Physical Plaque' : 'Digital Only'}</p>
                  {selectedRequest.delivery_type === 'plaque' && (
                    <p><span className="text-zinc-500">Color:</span> {selectedRequest.plaque_color}</p>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-white mb-2">Update Status</h4>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusUpdate(selectedRequest.id, e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-white mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes || selectedRequest.admin_notes || ''}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  className="bg-zinc-800 border-zinc-700 text-white h-24"
                />
              </div>

              {/* Email Composer */}
              <EmailComposer
                recipientEmail={selectedRequest.customer_email}
                recipientName={selectedRequest.customer_name}
                conciergeRequestId={selectedRequest.id}
                onEmailSent={() => {
                  // Refresh or show confirmation
                  console.log('Email sent to', selectedRequest.customer_email)
                }}
              />

              {/* Memorial Links */}
              {selectedRequest.digital_memorial_url && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Memorial Links</h4>
                  <div className="space-y-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                    >
                      <a href={selectedRequest.digital_memorial_url} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-2" />
                        View Memorial
                      </a>
                    </Button>
                    {selectedRequest.qr_code_url && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                      >
                        <a href={selectedRequest.qr_code_url} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download QR Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
