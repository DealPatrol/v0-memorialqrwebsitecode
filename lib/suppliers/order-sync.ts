import { createClient } from '@supabase/supabase-js';
import { SupplierFactory, SupplierOrderPayload } from '@/lib/suppliers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export interface OrderSyncLog {
  timestamp: string;
  action: string;
  status: string;
  message?: string;
}

async function getSupplierForProduct(productType: string): Promise<any> {
  // Try to find a product-specific supplier mapping
  const { data: mapping } = await supabase
    .from('product_supplier_mappings')
    .select('supplier_id, is_active')
    .eq('product_type', productType)
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .limit(1);

  if (mapping && mapping.length > 0) {
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', mapping[0].supplier_id)
      .eq('is_active', true)
      .single();

    return supplier;
  }

  // Fall back to primary supplier
  const { data: primarySupplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('is_primary', true)
    .eq('is_active', true)
    .single();

  if (primarySupplier) return primarySupplier;

  // Fall back to any active supplier
  const { data: anySupplier } = await supabase
    .from('suppliers')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .limit(1);

  if (anySupplier && anySupplier.length > 0) return anySupplier[0];

  throw new Error('No active suppliers configured');
}

export async function syncOrderToSupplier(orderId: string): Promise<boolean> {
  try {
    console.log('[v0] Syncing order to supplier:', orderId);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Get the appropriate supplier
    const supplier = await getSupplierForProduct(order.product_type);
    console.log('[v0] Found supplier:', supplier.name);

    // Create supplier client
    const client = SupplierFactory.createClient(supplier.api_type, supplier.api_key_encrypted);

    // Build supplier order payload
    const supplierOrderPayload: SupplierOrderPayload = {
      externalOrderId: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: {
        line1: order.shipping_address_line1,
        line2: order.shipping_address_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        zip: order.shipping_zip,
        country: order.shipping_country,
      },
      items: [
        {
          productId: order.product_type,
          quantity: order.quantity,
          customization: {
            engravingText: order.product_name,
          },
        },
      ],
      specialInstructions: order.special_instructions,
    };

    // Submit order to supplier
    const response = await client.submitOrder(supplierOrderPayload);

    if (!response.success) {
      throw new Error(response.error || 'Failed to submit order');
    }

    // Create order_suppliers record
    const { error: createError } = await supabase
      .from('order_suppliers')
      .insert({
        order_id: orderId,
        supplier_id: supplier.id,
        supplier_order_id: response.orderId,
        supplier_status: response.status,
        submitted_at: new Date().toISOString(),
        sync_logs: [
          {
            timestamp: new Date().toISOString(),
            action: 'submit',
            status: response.status,
            message: 'Order submitted to supplier',
          },
        ],
      });

    if (createError) {
      console.error('[v0] Error creating order_suppliers record:', createError);
      throw createError;
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('[v0] Error updating order status:', updateError);
      throw updateError;
    }

    console.log('[v0] Order synced successfully:', orderId);
    return true;
  } catch (error) {
    console.error('[v0] Error syncing order:', error);

    // Log error to order_suppliers
    const { data: orderSuppliers } = await supabase
      .from('order_suppliers')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderSuppliers) {
      const logs = orderSuppliers.sync_logs || [];
      logs.push({
        timestamp: new Date().toISOString(),
        action: 'submit_error',
        status: 'error',
        message: (error as Error).message,
      });

      const newRetryCount = (orderSuppliers.retry_count || 0) + 1;

      await supabase
        .from('order_suppliers')
        .update({
          supplier_status: 'error',
          last_error: (error as Error).message,
          retry_count: newRetryCount,
          sync_logs: logs,
        })
        .eq('order_id', orderId);
    }

    return false;
  }
}

export async function checkOrderStatus(orderId: string): Promise<string | null> {
  try {
    const { data: orderSuppliers } = await supabase
      .from('order_suppliers')
      .select('*, suppliers(*)')
      .eq('order_id', orderId)
      .single();

    if (!orderSuppliers) return null;

    const supplier = orderSuppliers.suppliers;
    const client = SupplierFactory.createClient(supplier.api_type, supplier.api_key_encrypted);

    const response = await client.checkOrderStatus(orderSuppliers.supplier_order_id);

    if (response.success) {
      const logs = orderSuppliers.sync_logs || [];
      logs.push({
        timestamp: new Date().toISOString(),
        action: 'status_check',
        status: response.status,
      });

      await supabase
        .from('order_suppliers')
        .update({
          supplier_status: response.status,
          tracking_number: response.trackingNumber,
          sync_logs: logs,
          ...(response.trackingNumber && { shipped_at: new Date().toISOString() }),
        })
        .eq('order_id', orderId);

      return response.status;
    }

    return null;
  } catch (error) {
    console.error('[v0] Error checking order status:', error);
    return null;
  }
}
