import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-400', exact: true },
  { to: '/admin/products', label: 'Products', icon: Package, color: 'text-emerald-400' },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, color: 'text-amber-400' },
  { to: '/admin/categories', label: 'Categories', icon: Tags, color: 'text-rose-400' },
  { to: '/admin/users', label: 'Users', icon: Users, color: 'text-violet-400' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#2a3548]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-teal flex items-center justify-center animate-pulse-glow">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-lg leading-tight">ShopVerse</p>
            <p className="text-xs text-cyan-400 font-semibold tracking-wider uppercase">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, i) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 animate-fade-in-left',
                `stagger-${i + 1}`,
                isActive
                  ? 'admin-nav-active text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-cyan-400' : item.color)} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a3548]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-bg min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex w-64 flex-col fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="admin-sidebar relative w-72 flex flex-col h-full animate-fade-in-left">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 admin-surface border-b border-[#2a3548] px-4 lg:px-8 h-16 flex items-center justify-between animate-fade-in-down">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Control Panel</p>
              <p className="text-white font-bold capitalize">
                {location.pathname.split('/').pop() || 'Dashboard'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-bounce-subtle" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-[#2a3548]">
              <div className="h-9 w-9 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) ?? 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-cyan-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fade-in-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
