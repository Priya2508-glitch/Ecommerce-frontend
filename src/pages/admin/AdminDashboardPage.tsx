import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { adminApi } from '@/api';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Animated } from '@/components/ui/Animated';

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl bg-[#1a2236]" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.revenue ?? 0),
      icon: DollarSign,
      gradient: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600',
      stagger: 1 as const,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      gradient: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600',
      stagger: 2 as const,
    },
    {
      title: 'Paid Orders',
      value: stats?.paidOrders ?? 0,
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500',
      stagger: 3 as const,
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      gradient: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
      stagger: 4 as const,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <AdminStatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
          <Animated animation="fade-in-up" stagger={5}>
            <div className="admin-surface rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Low Stock Alerts</h2>
                  <p className="text-sm text-slate-400">Products running low on inventory</p>
                </div>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.map((product, i) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${(i + 6) * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-amber-400" />
                      <span className="font-medium text-slate-200">{product.name}</span>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 border">
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Animated>
        )}

        <Animated animation="fade-in-up" stagger={6}>
          <div className="admin-surface rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 gradient-teal opacity-10 animate-gradient-shift" />
            <div className="relative">
              <h2 className="text-lg font-bold text-white mb-2">Quick Actions</h2>
              <p className="text-sm text-slate-400 mb-6">Manage your store efficiently</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Product', href: '/admin/products', color: 'from-emerald-500 to-teal-600' },
                  { label: 'View Orders', href: '/admin/orders', color: 'from-violet-500 to-purple-600' },
                  { label: 'Categories', href: '/admin/categories', color: 'from-rose-500 to-pink-600' },
                  { label: 'Users', href: '/admin/users', color: 'from-cyan-500 to-blue-600' },
                ].map((action, i) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white font-semibold text-sm text-center hover:scale-105 transition-transform duration-200 animate-scale-in`}
                    style={{ animationDelay: `${(i + 7) * 100}ms` }}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Animated>
      </div>
    </div>
  );
}
