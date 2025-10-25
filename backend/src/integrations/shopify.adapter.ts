import axios from 'axios';

export interface ShopifyConfig {
  shop: string;
  accessToken: string;
  apiVersion: string;
}

export class ShopifyAdapter {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(private config: ShopifyConfig) {
    this.baseUrl = `https://${config.shop}/admin/api/${config.apiVersion}`;
    this.headers = {
      'X-Shopify-Access-Token': config.accessToken,
      'Content-Type': 'application/json',
    };
  }

  async getOrders(params?: { limit?: number; status?: string }) {
    try {
      const response = await axios.get(`${this.baseUrl}/orders.json`, {
        headers: this.headers,
        params,
      });
      return response.data.orders;
    } catch (error: any) {
      console.error('Shopify API error:', error.response?.data || error.message);
      throw new Error('Failed to fetch orders from Shopify');
    }
  }

  async getOrder(orderId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/orders/${orderId}.json`, {
        headers: this.headers,
      });
      return response.data.order;
    } catch (error) {
      throw new Error('Failed to fetch order from Shopify');
    }
  }

  async getCustomers(params?: { limit?: number }) {
    try {
      const response = await axios.get(`${this.baseUrl}/customers.json`, {
        headers: this.headers,
        params,
      });
      return response.data.customers;
    } catch (error) {
      throw new Error('Failed to fetch customers from Shopify');
    }
  }

  async createWebhook(topic: string, address: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/webhooks.json`,
        {
          webhook: {
            topic,
            address,
            format: 'json',
          },
        },
        { headers: this.headers }
      );
      return response.data.webhook;
    } catch (error) {
      throw new Error('Failed to create Shopify webhook');
    }
  }
}
