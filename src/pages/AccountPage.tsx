import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
};

export function AccountPage() {
  const user = useAuthStore((s) => s.user);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getMine,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Account</h1>
      <p className="text-muted-foreground mb-8">
        Welcome, {user?.name} ({user?.email})
      </p>

      <h2 className="text-xl font-semibold mb-4">Order History</h2>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : orders?.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">
                  Order #{order._id.slice(-8).toUpperCase()}
                </CardTitle>
                <Badge variant={statusVariant[order.status] ?? 'secondary'}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-3">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
