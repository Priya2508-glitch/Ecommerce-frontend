import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/** Blocks admins from accessing the customer storefront */
export function StorefrontRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}

/** Customer-only protected routes (checkout, account) */
export function CustomerRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

/** Admin-only routes */
export function AdminRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

/** Guest-only routes — redirect logged-in users to their respective home */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }
  return <Outlet />;
}

/** Admin guest login — redirect if already logged in */
export function AdminGuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  if (isAuthenticated && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
