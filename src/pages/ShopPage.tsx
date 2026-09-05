import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useState } from 'react';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const page = Number(searchParams.get('page') ?? 1);
  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '-createdAt';

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, category, search, sort }],
    queryFn: () =>
      productsApi.getAll({
        page,
        limit: 12,
        category: category || undefined,
        search: search || undefined,
        sort,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!updates.page) params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: '1' });
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Our <span className="text-gradient">Shop</span>
        </h1>
        <p className="text-muted-foreground">Find exactly what you're looking for</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-24 space-y-5 p-6 rounded-2xl bg-white border border-violet-100 shadow-sm">
            <h3 className="font-bold text-lg text-gradient">Filters</h3>
            <form onSubmit={handleSearch}>
              <Input
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" className="w-full mt-2 rounded-xl" size="sm">
                Search
              </Button>
            </form>

            <div>
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Category</h3>
              <Select
                value={category}
                onChange={(e) => updateParams({ category: e.target.value, page: '1' })}
                className="rounded-xl"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Sort By</h3>
              <Select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value, page: '1' })}
                className="rounded-xl"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </Select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-violet-50 border border-violet-100">
              <p className="text-lg font-semibold text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground mb-6">
                Showing <span className="text-primary font-bold">{data?.data.length}</span> of{' '}
                <span className="text-primary font-bold">{data?.meta.total}</span> products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {data && data.meta.totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-5 text-sm font-semibold bg-violet-50 rounded-xl border border-violet-100">
                    Page {page} of {data.meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={page >= data.meta.totalPages}
                    onClick={() => updateParams({ page: String(page + 1) })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
