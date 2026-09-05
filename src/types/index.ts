export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: Category | string;
  featured: boolean;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalOrders: number;
  paidOrders: number;
  revenue: number;
  totalUsers: number;
  lowStockProducts: Product[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
