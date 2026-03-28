'use client'

import { useState } from 'react'
import { SupplierForm } from './supplier-form'
import { SupplierList } from './supplier-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SuppliersPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dropshipping Suppliers</h1>
          <p className="text-gray-600">
            Manage your dropshipping suppliers and configure automatic order routing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Setup Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Database configured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>API clients ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Add your first supplier</span>
              </div>
              <div className="pt-2 border-t text-xs text-gray-600">
                <p>
                  <strong>Next:</strong> Set ENCRYPTION_SECRET environment variable in Vercel settings
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
              <CardDescription>Get started with dropshipping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Get API credentials from your supplier (Printful, Printfusion, etc.)</li>
                <li>Add the supplier using the form on the right</li>
                <li>Test the connection to verify credentials</li>
                <li>Orders will automatically sync when customers purchase</li>
              </ol>
              <div className="pt-3 border-t">
                <p className="font-medium mb-1">Supported Suppliers:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ Printful (print-on-demand)</li>
                  <li>✓ Printfusion (custom engraving)</li>
                  <li>✓ Printnode (volume orders)</li>
                  <li>✓ Custom suppliers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SupplierForm onSuccess={handleSuccess} />
          </div>

          <div className="lg:col-span-2">
            <SupplierList key={refreshTrigger} onRefresh={handleSuccess} />
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">How Orders Are Routed</h4>
              <p className="text-gray-700">
                Orders are automatically routed to your configured suppliers based on product type and supplier
                priority. Your primary supplier receives orders first, with fallback options for reliability.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Encryption & Security</h4>
              <p className="text-gray-700">
                API keys are encrypted using AES-256-GCM before being stored in the database. The{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">ENCRYPTION_SECRET</code> environment
                variable must be set in your Vercel project settings.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Monitoring</h4>
              <p className="text-gray-700">
                Visit the{' '}
                <a href="/admin/order-sync" className="text-blue-600 hover:underline">
                  Order Sync Dashboard
                </a>{' '}
                to monitor supplier status, view logs, and manually resync orders if needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
