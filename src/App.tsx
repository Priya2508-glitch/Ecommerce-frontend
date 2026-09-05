import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Toaster } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import {
  StorefrontRoute,
  CustomerRoute,
  AdminRoute,
  GuestRoute,
  AdminGuestRoute,
} from '@/components/layout/ProtectedRoute';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage';
import { CheckoutCancelPage } from '@/pages/CheckoutCancelPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AccountPage } from '@/pages/AccountPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Customer storefront — admins are redirected to /admin */}
          <Route element={<StorefrontRoute />}>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="checkout/cancel" element={<CheckoutCancelPage />} />

              <Route element={<GuestRoute />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              <Route element={<CustomerRoute />}>
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="account" element={<AccountPage />} />
              </Route>
            </Route>
          </Route>

          {/* Admin login (separate from customer login) */}
          <Route element={<AdminGuestRoute />}>
            <Route path="admin/login" element={<AdminLoginPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        icons={{ close: <X className="h-4 w-4" /> }}
        toastOptions={{ closeButton: true }}
      />
    </QueryClientProvider>
  );
}
