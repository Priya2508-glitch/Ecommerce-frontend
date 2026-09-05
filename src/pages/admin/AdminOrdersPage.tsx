import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, ordersApi } from '@/api';
import { formatPrice } from '@/lib/utils';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import type { Order } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  delivered: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

export function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminApi.getOrders(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const getUserName = (order: Order) => {
    if (typeof order.user === 'object' && order.user?.name) return order.user.name;
    return 'Unknown';
  };

  return (
    <div>
      <AdminPageHeader title="Orders" subtitle="Track and manage customer orders" />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl bg-[#1a2236]" />
      ) : data?.data.length === 0 ? (
        <div className="admin-surface rounded-2xl p-12 text-center animate-fade-in-up">
          <p className="text-slate-400 text-lg">No orders yet</p>
        </div>
      ) : (
        <AdminTable headers={['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Update']}>
          {data?.data.map((order, i) => (
            <tr key={order._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <td className="p-4 font-mono text-xs text-cyan-400">
                #{order._id.slice(-8).toUpperCase()}
              </td>
              <td className="p-4 font-medium">{getUserName(order)}</td>
              <td className="p-4 text-emerald-400 font-bold">{formatPrice(order.total)}</td>
              <td className="p-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[order.status] ?? ''}`}>
                  {order.status}
                </span>
              </td>
              <td className="p-4 text-slate-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4">
                <Select
                  value={order.status}
                  onChange={(e) => updateMutation.mutate({ id: order._id, status: e.target.value })}
                  className="rounded-lg bg-[#0c1222] border-[#2a3548] text-slate-200 text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
