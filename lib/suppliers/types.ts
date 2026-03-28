// Types for supplier integrations

export interface SupplierOrder {
  id: string;
  externalOrderId: string;
  status: 'pending' | 'submitted' | 'processing' | 'printed' | 'shipped' | 'error';
  trackingNumber?: string;
  shippedAt?: Date;
  lastError?: string;
  retryCount: number;
}

export interface SupplierConfig {
  apiKey: string;
  apiEndpoint: string;
  webhookSecret?: string;
  productMappings?: Record<string, string>;
}

export interface SupplierOrderPayload {
  externalOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    customization?: Record<string, any>;
  }>;
  specialInstructions?: string;
}

export interface SupplierResponse {
  success: boolean;
  orderId?: string;
  status?: string;
  trackingNumber?: string;
  error?: string;
  retryable?: boolean;
}

export abstract class BaseSupplierClient {
  protected apiKey: string;
  protected apiEndpoint: string;
  protected apiType: string;

  constructor(apiKey: string, apiEndpoint: string, apiType: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = apiEndpoint;
    this.apiType = apiType;
  }

  abstract submitOrder(order: SupplierOrderPayload): Promise<SupplierResponse>;
  abstract checkOrderStatus(externalOrderId: string): Promise<SupplierResponse>;
  abstract cancelOrder(externalOrderId: string): Promise<SupplierResponse>;
  abstract validateConnection(): Promise<boolean>;

  protected async fetchWithAuth(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<any> {
    const url = `${this.apiEndpoint}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Supplier API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
