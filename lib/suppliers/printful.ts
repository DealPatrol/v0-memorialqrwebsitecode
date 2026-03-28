import { BaseSupplierClient, SupplierOrderPayload, SupplierResponse } from './types';

export class PrintfulClient extends BaseSupplierClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.printful.com', 'printful');
  }

  async submitOrder(order: SupplierOrderPayload): Promise<SupplierResponse> {
    try {
      const payload = {
        external_id: order.externalOrderId,
        shipping: 'STANDARD',
        items: order.items.map((item) => ({
          product_id: parseInt(item.productId),
          quantity: item.quantity,
          variant_id: item.customization?.variantId,
        })),
        recipient: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          address1: order.shippingAddress.line1,
          address2: order.shippingAddress.line2,
          city: order.shippingAddress.city,
          state_code: order.shippingAddress.state,
          zip_code: order.shippingAddress.zip,
          country_code: order.shippingAddress.country,
        },
        notes: order.specialInstructions,
      };

      const response = await this.fetchWithAuth('/orders', 'POST', payload);

      return {
        success: true,
        orderId: response.result.id.toString(),
        status: response.result.status,
      };
    } catch (error: any) {
      console.error('[v0] Printful submitOrder error:', error);
      return {
        success: false,
        error: error.message,
        retryable: true,
      };
    }
  }

  async checkOrderStatus(externalOrderId: string): Promise<SupplierResponse> {
    try {
      const response = await this.fetchWithAuth(`/orders/external/${externalOrderId}`);
      const order = response.result;

      return {
        success: true,
        status: order.status,
        trackingNumber: order.shipments?.[0]?.tracking_number,
      };
    } catch (error: any) {
      console.error('[v0] Printful checkOrderStatus error:', error);
      return {
        success: false,
        error: error.message,
        retryable: error.status !== 404,
      };
    }
  }

  async cancelOrder(externalOrderId: string): Promise<SupplierResponse> {
    try {
      await this.fetchWithAuth(`/orders/external/${externalOrderId}`, 'DELETE');
      return { success: true, status: 'cancelled' };
    } catch (error: any) {
      console.error('[v0] Printful cancelOrder error:', error);
      return {
        success: false,
        error: error.message,
        retryable: error.status !== 404,
      };
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.fetchWithAuth('/store');
      return true;
    } catch {
      return false;
    }
  }
}
