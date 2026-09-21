import { api } from './client';
import type {
  AuthResponse,
  User,
  Product,
  Category,
  PaginatedResponse,
  Cart,
  Order,
  ShippingAddress,
  AdminStats,
  Review,
} from '@/types';

export const authApi = {
  register: (data: { gmail: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  login: (data: { gmail: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
};

export const productsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data),
  getFeatured: () =>
    api.get<Product[]>('/products/featured').then((r) => r.data),
  getBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`).then((r) => r.data),
  create: (data: Partial<Product>) =>
    api.post<Product>('/products', data).then((r) => r.data),
  update: (id: string, data: Partial<Product>) =>
    api.patch<Product>(`/products/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/products/${id}`).then((r) => r.data),
};

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories').then((r) => r.data),
  create: (data: Partial<Category>) =>
    api.post<Category>('/categories', data).then((r) => r.data),
  update: (id: string, data: Partial<Category>) =>
    api.patch<Category>(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/categories/${id}`).then((r) => r.data),
};

export const cartApi = {
  get: () => api.get<Cart>('/cart').then((r) => r.data),
  addItem: (productId: string, quantity: number) =>
    api.post<Cart>('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (productId: string, quantity: number) =>
    api.patch<Cart>(`/cart/items/${productId}`, { quantity }).then((r) => r.data),
  removeItem: (productId: string) =>
    api.delete<Cart>(`/cart/items/${productId}`).then((r) => r.data),
  clear: () => api.delete<Cart>('/cart').then((r) => r.data),
  merge: (items: { productId: string; quantity: number }[]) =>
    api.post<Cart>('/cart/merge', { items }).then((r) => r.data),
};

export const ordersApi = {
  create: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: ShippingAddress;
  }) => api.post<Order>('/orders', data).then((r) => r.data),
  getMine: () => api.get<Order[]>('/orders').then((r) => r.data),
  getById: (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data),
};

export const paymentsApi = {
  createCheckoutSession: (orderId: string) =>
    api
      .post<{ sessionId: string; url: string }>('/payments/create-checkout-session', {
        orderId,
      })
      .then((r) => r.data),
};

export const reviewsApi = {
  getByProduct: (productId: string) =>
    api
      .get<{ reviews: Review[]; stats: { averageRating: number; count: number } }>(
        `/products/${productId}/reviews`,
      )
      .then((r) => r.data),
  create: (productId: string, data: { rating: number; comment: string }) =>
    api.post<Review>(`/products/${productId}/reviews`, data).then((r) => r.data),
};

export const adminApi = {
  getStats: () => api.get<AdminStats>('/admin/stats').then((r) => r.data),
  getUsers: () => api.get<User[]>('/admin/users').then((r) => r.data),
  getOrders: (page = 1) =>
    api
      .get<{ data: Order[]; meta: { total: number; page: number; limit: number } }>(
        '/admin/orders',
        { params: { page } },
      )
      .then((r) => r.data),
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post<{ url: string; filename: string }>('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
