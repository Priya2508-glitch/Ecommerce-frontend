import { Link } from 'react-router-dom';
import { ShoppingCart, Sparkles } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const categoryName =
    typeof product.category === 'object' ? product.category.name : '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? '',
      stock: product.stock,
    });
    toast.success('Added to cart');
  };

  return (
    <Card className="group overflow-hidden hover:shadow-glow shadow-glow-hover border-violet-100/80 hover:border-violet-300/60 hover:-translate-y-1 transition-all duration-300">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-violet-50 to-fuchsia-50 relative">
          {product.featured && (
            <Badge className="absolute top-3 left-3 z-10 gradient-accent border-0 text-white shadow-md gap-1">
              <Sparkles className="h-3 w-3" /> Featured
            </Badge>
          )}
          <img
            src={getImageUrl(product.images[0] ?? '')}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4">
          {categoryName && (
            <span className="inline-block text-xs font-semibold text-primary bg-violet-100 px-2.5 py-0.5 rounded-full mb-2">
              {categoryName}
            </span>
          )}
          <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-extrabold text-gradient">
              {formatPrice(product.price)}
            </span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-xs font-semibold text-destructive bg-red-50 px-2 py-0.5 rounded-full">
                Sold out
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <div className="px-4 pb-4">
        <Button
          className="w-full rounded-xl"
          size="sm"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
