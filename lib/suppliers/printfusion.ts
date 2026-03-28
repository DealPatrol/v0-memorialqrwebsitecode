import { BaseSupplierClient, SupplierOrderPayload, SupplierResponse } from './types';

export class PrintfusionClient extends BaseSupplierClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.printfusion.com', 'printfusion');
  }

  async submitOrder(order: SupplierOrderPayload): Promise<SupplierResponse> {
    try {
      const payload = {
        order_id: order.externalOrderId,
        customer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
        },
        shipping: {
          method: 'standard',
          address: {
            street1: order.shippingAddress.line1,
            street2: order.shippingAddress.line2,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zip: order.shippingAddress.zip,
            country: order.shippingAddress.country,
          },
        },
        items: order.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          engraving: item.customization?.engravingText,
          engraving_font: item.customization?.engravingFont || 'arial',
        })),
        notes: order.specialInstructions,
      };

      const response = await this.fetchWithAuth('/v1/orders', 'POST', payload);

      return {
        success: true,
        orderId: response.data.order_id,
        status: response.data.status,
      };
    } catch (error: any) {
      console.error('[v0] Printfusion submitOrder error:', error);
      return {
        success: false,
        error: error.message,
        retryable: true,
      };
    }
  }

  async checkOrderStatus(externalOrderId: string): Promise<SupplierResponse> {
    try {
      const response = await this.fetchWithAuth(`/v1/orders/${externalOrderId}`);

      return {
        success: true,
        status: response.data.status,
        trackingNumber: response.data.tracking_number,
      };
    } catch (error: any) {
      console.error('[v0] Printfusion checkOrderStatus error:', error);
      return {
        success: false,
        error: error.message,
        retryable: error.status !== 404,
      };
    }
  }

  async cancelOrder(externalOrderId: string): Promise<SupplierResponse> {
    try {
      await this.fetchWithAuth(`/v1/orders/${externalOrderId}/cancel`, 'POST');
      return { success: true, status: 'cancelled' };
    } catch (error: any) {
      console.error('[v0] Printfusion cancelOrder error:', error);
      return {
        success: false,
        error: error.message,
        retryable: error.status !== 404,
      };
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.fetchWithAuth('/v1/health');
      return true;
    } catch {
      return false;
    }
  }
}
