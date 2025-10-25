const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('accessToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const data = await this.request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.setToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }

  async logout() {
    await this.request('/api/v1/auth/logout', { method: 'POST' });
    this.clearToken();
    localStorage.removeItem('refreshToken');
  }

  // Orders
  async getOrders(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return this.request<{
      data: any[];
      pagination: any;
    }>(`/api/v1/orders?${searchParams}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/api/v1/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<any>(`/api/v1/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Customers
  async getCustomers(params?: { search?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return this.request<{
      data: any[];
      pagination: any;
    }>(`/api/v1/customers?${searchParams}`);
  }

  async getCustomer(id: string) {
    return this.request<any>(`/api/v1/customers/${id}`);
  }

  // Emails
  async getEmails(params?: { orderId?: string; unread?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.orderId) searchParams.set('orderId', params.orderId);
    if (params?.unread !== undefined)
      searchParams.set('unread', params.unread.toString());

    return this.request<any[]>(`/api/v1/emails?${searchParams}`);
  }

  async markEmailRead(id: string, isUnread: boolean) {
    return this.request<any>(`/api/v1/emails/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isUnread }),
    });
  }

  // Invoices
  async getInvoices(orderId?: string) {
    const searchParams = new URLSearchParams();
    if (orderId) searchParams.set('orderId', orderId);

    return this.request<any[]>(`/api/v1/invoices?${searchParams}`);
  }

  async createInvoice(orderId: string) {
    return this.request<any>('/api/v1/invoices', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  // Integrations
  async getIntegrations() {
    return this.request<any[]>('/api/v1/integrations');
  }

  async syncIntegration(provider: string) {
    return this.request<any>(`/api/v1/integrations/${provider}/sync`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient(API_BASE);
