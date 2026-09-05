import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8">
        Your payment was cancelled. Your cart items are still saved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/checkout">
          <Button>Try Again</Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline">Back to Cart</Button>
        </Link>
      </div>
    </div>
  );
}
