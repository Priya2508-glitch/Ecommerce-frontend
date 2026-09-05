import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { productsApi, reviewsApi } from '@/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: () => reviewsApi.getByProduct(product!._id),
    enabled: !!product?._id,
  });

  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.create(product!._id, { rating, comment }),
    onSuccess: () => {
      toast.success('Review submitted');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', product?._id] });
    },
    onError: () => toast.error('Failed to submit review'),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const categoryName =
    typeof product.category === 'object' ? product.category.name : '';

  const handleAddToCart = () => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] ?? '',
        stock: product.stock,
      },
      quantity,
    );
    toast.success('Added to cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={getImageUrl(product.images[0] ?? '')}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          {categoryName && (
            <Badge variant="secondary" className="mb-2">{categoryName}</Badge>
          )}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {reviewData && reviewData.stats.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(reviewData.stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviewData.stats.count} reviews)
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-primary mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <Label>In Stock: {product.stock}</Label>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="qty">Qty:</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20"
              />
            </div>
            <Button
              size="lg"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        {isAuthenticated && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              reviewMutation.mutate();
            }}
            className="mb-8 p-6 border border-border rounded-lg space-y-4 max-w-lg"
          >
            <h3 className="font-semibold">Write a Review</h3>
            <div>
              <Label>Rating</Label>
              <Select value={String(rating)} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                required
                minLength={5}
              />
            </div>
            <Button type="submit" disabled={reviewMutation.isPending}>
              Submit Review
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {reviewData?.reviews.length === 0 && (
            <p className="text-muted-foreground">No reviews yet. Be the first!</p>
          )}
          {reviewData?.reviews.map((review) => (
            <div key={review._id} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{review.user.name}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}