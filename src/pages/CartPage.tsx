import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products to get started.</p>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4 flex gap-4">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-24 w-24 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.slug}`}
                    className="font-semibold hover:text-primary line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-primary font-bold mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-auto text-destructive"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right font-semibold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{subtotal >= 50 ? 'Free' : formatPrice(5.99)}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {formatPrice(subtotal + (subtotal >= 50 ? 0 : 5.99))}
                </span>
              </div>
              <Link to="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/shop" className="block">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
