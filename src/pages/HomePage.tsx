import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Truck, Shield, RefreshCw, Star } from 'lucide-react';
import { productsApi, categoriesApi } from '@/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getCategoryStyle } from '@/lib/categoryStyles';
import { Animated } from '@/components/ui/Animated';

const perks = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50', color: 'text-violet-500 bg-violet-100' },
  { icon: Shield, label: 'Secure Payment', desc: '100% protected checkout', color: 'text-emerald-500 bg-emerald-100' },
  { icon: RefreshCw, label: 'Easy Returns', desc: '30-day return policy', color: 'text-orange-500 bg-orange-100' },
  { icon: Star, label: 'Top Quality', desc: 'Curated products only', color: 'text-pink-500 bg-pink-100' },
];

export function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productsApi.getFeatured,
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden py-24 md:py-32 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-violet-400/10 blur-2xl animate-float" />
        </div>
        <div className="container mx-auto text-center max-w-4xl relative">
          <Animated animation="fade-in-down">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-fuchsia-200 text-sm font-semibold mb-6 border border-white/20 backdrop-blur-sm">
              ✨ New Season Collection 2026
            </span>
          </Animated>
          <Animated animation="fade-in-up" stagger={1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Shop Smarter,{' '}
              <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-orange-300 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                Live Better
              </span>
            </h1>
          </Animated>
          <Animated animation="fade-in-up" stagger={2}>
            <p className="text-lg md:text-xl text-violet-200/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover curated products across electronics, fashion, home & more.
              Free shipping on orders over $50.
            </p>
          </Animated>
          <Animated animation="fade-in-up" stagger={3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" variant="accent" className="gap-2 rounded-xl px-8">
                Shop Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/shop?featured=true">
              <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5">
                View Featured
              </Button>
            </Link>
          </div>
          </Animated>
        </div>
      </section>

      {/* Perks bar */}
      <section className="bg-white border-y border-violet-100 py-8 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {perks.map((perk, i) => (
            <Animated key={perk.label} animation="scale-in" stagger={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${perk.color} animate-bounce-subtle`} style={{ animationDelay: `${i * 0.5}s` }}>
                  <perk.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{perk.label}</p>
                  <p className="text-xs text-muted-foreground">{perk.desc}</p>
                </div>
              </div>
            </Animated>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-muted-foreground">Browse our curated collections</p>
        </div>
        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories?.map((cat, i) => {
              const style = getCategoryStyle(cat.name);
              return (
                <Animated key={cat._id} animation="fade-in-up" stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
                  <Link
                    to={`/shop?category=${cat._id}`}
                    className={`group relative overflow-hidden rounded-2xl border-2 ${style.border} transition-all duration-300 hover:shadow-glow hover:-translate-y-2 block`}
                  >
                    <div className={`bg-gradient-to-br ${style.bg} p-6 text-white text-center min-h-[140px] flex flex-col items-center justify-center gap-2`}>
                      <span className="text-3xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">{style.icon}</span>
                      <span className="font-bold text-sm md:text-base">{cat.name}</span>
                    </div>
                  </Link>
                </Animated>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="bg-gradient-to-b from-violet-50/80 to-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-muted-foreground mt-1">Hand-picked favorites for you</p>
            </div>
            <Link to="/shop">
              <Button variant="outline" size="sm" className="rounded-xl hidden sm:flex">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured?.map((product, i) => (
                <Animated key={product._id} animation="fade-in-up" stagger={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <ProductCard product={product} />
                </Animated>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl gradient-primary p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Join ShopVerse Today</h2>
            <p className="text-violet-100 mb-8 max-w-lg mx-auto">
              Create an account for exclusive deals, faster checkout, and order tracking.
            </p>
            <Link to="/register">
              <Button variant="accent" size="lg" className="rounded-xl px-10">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
