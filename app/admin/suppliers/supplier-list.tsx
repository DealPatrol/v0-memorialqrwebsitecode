'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader, Trash2, Edit } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  slug: string
  api_type: string
  is_active: boolean
  is_primary: boolean
  priority: number
  created_at: string
  admin_notes: string | null
}

interface SupplierListProps {
  onRefresh?: () => void
}

export function SupplierList({ onRefresh }: SupplierListProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/suppliers/list')
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      setSuppliers(data.suppliers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return

    try {
      const response = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete supplier')
      await fetchSuppliers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete supplier')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      })
      if (!response.ok) throw new Error('Failed to update supplier')
      await fetchSuppliers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update supplier')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Loading suppliers...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (suppliers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configured Suppliers</CardTitle>
          <CardDescription>No suppliers configured yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Add your first supplier above to get started with automatic order routing.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configured Suppliers</CardTitle>
        <CardDescription>{suppliers.length} supplier(s) active</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{supplier.name}</h3>
                  {supplier.is_primary && (
                    <Badge variant="default" className="bg-blue-600">
                      Primary
                    </Badge>
                  )}
                  <Badge
                    variant={supplier.is_active ? 'secondary' : 'outline'}
                    className={supplier.is_active ? 'bg-green-100 text-green-800' : ''}
                  >
                    {supplier.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {supplier.api_type} • Priority: {supplier.priority}
                </p>
                {supplier.admin_notes && (
                  <p className="text-sm text-gray-500 mt-1">{supplier.admin_notes}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(supplier.id, supplier.is_active)}
                >
                  {supplier.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(supplier.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
