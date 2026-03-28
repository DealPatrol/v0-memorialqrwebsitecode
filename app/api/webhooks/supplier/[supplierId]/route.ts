import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function POST(
  req: NextRequest,
  { params }: { params: { supplierId: string } }
) {
  try {
    const body = await req.json()
    const supabase = createServiceRoleClient()

    console.log('[v0] Received webhook from supplier:', params.supplierId, body)

    const { supplier_order_id, status, tracking_number, event_type } = body

    if (!supplier_order_id) {
      return NextResponse.json({ error: 'Missing supplier_order_id' }, { status: 400 })
    }

    // Find the order_supplier record
    const { data: orderSupplier, error: fetchError } = await supabase
      .from('order_suppliers')
      .select('*')
      .eq('supplier_id', params.supplierId)
      .eq('supplier_order_id', supplier_order_id)
      .single()

    if (fetchError || !orderSupplier) {
      console.warn('[v0] Order supplier not found:', params.supplierId, supplier_order_id)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order supplier with new status
    const updateData: any = {
      supplier_status: status || orderSupplier.supplier_status,
      updated_at: new Date().toISOString(),
    }

    if (tracking_number) {
      updateData.tracking_number = tracking_number
      updateData.shipped_at = new Date().toISOString()
    }

    // Add to sync logs
    const currentLogs = orderSupplier.sync_logs || []
    currentLogs.push({
      timestamp: new Date().toISOString(),
      event: event_type || status,
      details: body,
    })
    updateData.sync_logs = currentLogs

    const { error: updateError } = await supabase
      .from('order_suppliers')
      .update(updateData)
      .eq('id', orderSupplier.id)

    if (updateError) {
      console.error('[v0] Error updating order supplier:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // TODO: Send customer notification about order status update
    console.log('[v0] Successfully updated order supplier:', orderSupplier.id)

    return NextResponse.json({ success: true, order_supplier_id: orderSupplier.id })
  } catch (error) {
    console.error('[v0] Error processing supplier webhook:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
