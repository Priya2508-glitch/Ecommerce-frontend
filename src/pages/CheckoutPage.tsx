import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ordersApi, paymentsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Phone is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'United States' },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const order = await ordersApi.create({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shippingAddress: data,
      });
      const session = await paymentsApi.createCheckoutSession(order._id);
      return session;
    },
    onSuccess: (session) => {
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error('Failed to create payment session');
      }
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Checkout failed';
      toast.error(message);
    },
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form
        onSubmit={handleSubmit((data) => checkoutMutation.mutate(data))}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input id="addressLine1" {...register('addressLine1')} />
              {errors.addressLine1 && (
                <p className="text-sm text-destructive mt-1">{errors.addressLine1.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input id="addressLine2" {...register('addressLine2')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
                {errors.city && (
                  <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('state')} />
                {errors.state && (
                  <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register('postalCode')} />
                {errors.postalCode && (
                  <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} />
                {errors.country && (
                  <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? 'Processing...' : 'Pay with Stripe'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
