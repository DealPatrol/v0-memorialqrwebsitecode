import { BaseSupplierClient, SupplierOrderPayload, SupplierResponse } from './types';

export class PrintnodeClient extends BaseSupplierClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.printnode.com', 'printnode');
  }

  async submitOrder(order: SupplierOrderPayload): Promise<SupplierResponse> {
    try {
      const payload = {
        externalId: order.externalOrderId,
        recipient: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          address1: order.shippingAddress.line1,
          address2: order.shippingAddress.line2,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.zip,
          country: order.shippingAddress.country,
        },
        lineItems: order.items.map((item) => ({
          printNodeProductId: item.productId,
          quantity: item.quantity,
          variants: item.customization?.variants || {},
        })),
        shippingMethod: 'STANDARD',
        specialInstructions: order.specialInstructions,
      };

      const response = await this.fetchWithAuth('/v2/orders', 'POST', payload);

      return {
        success: true,
        orderId: response.id,
        status: 'submitted',
      };
    } catch (error: any) {
      console.error('[v0] Printnode submitOrder error:', error);
      return {
        success: false,
        error: error.message,
        retryable: true,
      };
    }
  }

  async checkOrderStatus(externalOrderId: string): Promise<SupplierResponse> {
    try {
      const response = await this.fetchWithAuth(`/v2/orders?externalId=${externalOrderId}`);
      const order = response.data?.[0];

      if (!order) {
        return {
          success: false,
          error: 'Order not found',
          retryable: false,
        };
      }

      return {
        success: true,
        status: order.status,
        trackingNumber: order.trackingNumber,
      };
    } catch (error: any) {
      console.error('[v0] Printnode checkOrderStatus error:', error);
      return {
        success: false,
        error: error.message,
        retryable: true,
      };
    }
  }

  async cancelOrder(externalOrderId: string): Promise<SupplierResponse> {
    try {
      const orders = await this.fetchWithAuth(`/v2/orders?externalId=${externalOrderId}`);
      const orderId = orders.data?.[0]?.id;

      if (!orderId) {
        return {
          success: false,
          error: 'Order not found',
          retryable: false,
        };
      }

      await this.fetchWithAuth(`/v2/orders/${orderId}/cancel`, 'POST');
      return { success: true, status: 'cancelled' };
    } catch (error: any) {
      console.error('[v0] Printnode cancelOrder error:', error);
      return {
        success: false,
        error: error.message,
        retryable: true,
      };
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.fetchWithAuth('/v2/account');
      return true;
    } catch {
      return false;
    }
  }
}
