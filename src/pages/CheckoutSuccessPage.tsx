import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-2">
        Thank you for your purchase. Your payment was successful.
      </p>
      {orderId && (
        <p className="text-sm text-muted-foreground mb-8">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <div className="flex gap-4 justify-center">
        <Link to="/account">
          <Button>View Orders</Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
