import axios from 'axios';

export interface InvoiceProvider {
  createInvoice(order: any): Promise<any>;
  getInvoicePdf(invoiceId: string): Promise<string>;
}

export interface WFirmaConfig {
  companyId: string;
  accessKey: string;
  secretKey: string;
  baseUrl: string;
}

export class WFirmaProvider implements InvoiceProvider {
  constructor(private config: WFirmaConfig) {}

  async createInvoice(order: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/invoices`,
        {
          companyId: this.config.companyId,
          customer: {
            name: `${order.customer.firstName} ${order.customer.lastName}`,
            email: order.customer.email,
          },
          items: order.productTitles.map((title: string) => ({
            name: title,
            quantity: 1,
            price: order.totalAmount / order.productTitles.length,
          })),
          total: order.totalAmount,
          currency: order.currency,
        },
        {
          headers: {
            'X-AccessKey': this.config.accessKey,
            'X-SecretKey': this.config.secretKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        externalId: response.data.id,
        pdfUrl: response.data.pdfUrl,
      };
    } catch (error: any) {
      console.error('wFirma API error:', error.response?.data || error.message);
      throw new Error('Failed to create invoice in wFirma');
    }
  }

  async getInvoicePdf(invoiceId: string): Promise<string> {
    // Implementation would fetch PDF from wFirma
    return `${this.config.baseUrl}/invoices/${invoiceId}/pdf`;
  }
}

export class MockInvoiceProvider implements InvoiceProvider {
  async createInvoice(order: any): Promise<any> {
    console.log('MockInvoiceProvider: Creating invoice for order', order.number);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      externalId: `MOCK-INV-${Date.now()}`,
      pdfUrl: `https://example.com/invoices/mock-${order.number}.pdf`,
    };
  }

  async getInvoicePdf(invoiceId: string): Promise<string> {
    return `https://example.com/invoices/${invoiceId}.pdf`;
  }
}

export function createInvoiceProvider(config?: WFirmaConfig): InvoiceProvider {
  const useMock = process.env.ENABLE_PROVIDER_MOCK === 'true';

  if (useMock || !config) {
    console.log('Using MockInvoiceProvider');
    return new MockInvoiceProvider();
  }

  return new WFirmaProvider(config);
}
