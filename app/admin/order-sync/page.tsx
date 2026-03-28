'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function OrderSyncPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrderSync();
  }, []);

  async function loadOrderSync() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_suppliers')
        .select('*, orders(*), suppliers(name, api_type)')
        .order('submitted_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('[v0] Error loading order sync:', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshOrderSync() {
    setRefreshing(true);
    await loadOrderSync();
    setRefreshing(false);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'printed':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped':
      case 'printed':
      case 'processing':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Supplier Sync</h1>
          <p className="text-gray-600 mt-2">
            Track how orders are routed to and processed by suppliers.
          </p>
        </div>
        <Button onClick={refreshOrderSync} disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <SyncStatCard
          label="Total Orders"
          value={orders.length}
          color="bg-blue-50"
        />
        <SyncStatCard
          label="Shipped"
          value={orders.filter((o) => o.supplier_status === 'shipped').length}
          color="bg-green-50"
        />
        <SyncStatCard
          label="Processing"
          value={orders.filter((o) => o.supplier_status === 'processing').length}
          color="bg-yellow-50"
        />
        <SyncStatCard
          label="Errors"
          value={orders.filter((o) => o.supplier_status === 'error').length}
          color="bg-red-50"
        />
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No orders synced to suppliers yet.</p>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div>
                  <p className="font-medium text-sm">Order</p>
                  <p className="text-gray-600 text-sm">{order.orders?.order_number}</p>
                </div>

                <div>
                  <p className="font-medium text-sm">Customer</p>
                  <p className="text-gray-600 text-sm">{order.orders?.customer_name}</p>
                </div>

                <div>
                  <p className="font-medium text-sm">Supplier</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 text-sm">{order.suppliers?.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {order.suppliers?.api_type}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm">Status</p>
                  <Badge className={`${getStatusColor(order.supplier_status)}`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.supplier_status)}
                      {order.supplier_status}
                    </span>
                  </Badge>
                </div>

                <div>
                  <p className="font-medium text-sm">Tracking</p>
                  <p className="text-gray-600 text-sm font-mono">
                    {order.tracking_number || '—'}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm">Submitted</p>
                  <p className="text-gray-600 text-sm">
                    {order.submitted_at
                      ? new Date(order.submitted_at).toLocaleDateString()
                      : '—'}
                  </p>
                </div>
              </div>

              {order.last_error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <p className="font-medium">Error:</p>
                  <p>{order.last_error}</p>
                </div>
              )}

              {order.sync_logs && order.sync_logs.length > 0 && (
                <details className="mt-3 cursor-pointer">
                  <summary className="text-sm text-blue-600 font-medium hover:underline">
                    View sync logs ({order.sync_logs.length})
                  </summary>
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    {order.sync_logs.map((log: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="font-medium">{log.action}:</span>
                        <span>{log.status}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function SyncStatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className={`p-4 ${color}`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </Card>
  );
}
