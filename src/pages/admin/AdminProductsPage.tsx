import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { productsApi, categoriesApi, uploadApi } from '@/api';
import type { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, AdminFormPanel } from '@/components/admin/AdminTable';

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    featured: false,
    images: [] as string[],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => productsApi.getAll({ limit: 100 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category: '', featured: false, images: [] });
    setEditing(null);
    setShowForm(false);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      productsApi.create({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        featured: form.featured,
        images: form.images,
      }),
    onSuccess: () => {
      toast.success('Product created');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      resetForm();
    },
    onError: () => toast.error('Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      productsApi.update(editing!._id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        featured: form.featured,
        images: form.images,
      }),
    onSuccess: () => {
      toast.success('Product updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      resetForm();
    },
    onError: () => toast.error('Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: typeof product.category === 'object' ? product.category._id : product.category,
      featured: product.featured,
      images: product.images,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadApi.uploadImage(file);
      setForm((f) => ({ ...f, images: [...f.images, result.url] }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        subtitle="Manage your product catalog"
        action={
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="gradient-teal rounded-xl border-0 text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      {showForm && (
        <AdminFormPanel title={editing ? 'Edit Product' : 'New Product'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-slate-300">Category</Label>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label className="text-slate-300">Price</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label className="text-slate-300">Stock</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="text-slate-300">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label className="text-slate-300">Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {form.images.map((img, i) => (
                  <img key={i} src={getImageUrl(img)} alt="" className="h-16 w-16 object-cover rounded-xl ring-2 ring-cyan-500/30" />
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-cyan-500" />
            Featured product
          </label>
          <div className="flex gap-2">
            <Button
              onClick={() => (editing ? updateMutation.mutate() : createMutation.mutate())}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="gradient-teal rounded-xl border-0 text-white"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-xl border-[#2a3548] text-slate-300 hover:bg-white/5">
              Cancel
            </Button>
          </div>
        </AdminFormPanel>
      )}

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl bg-[#1a2236]" />
      ) : (
        <AdminTable headers={['Product', 'Price', 'Stock', 'Featured', 'Actions']}>
          {data?.data.map((product, i) => (
            <tr key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={getImageUrl(product.images[0] ?? '')} alt="" className="h-10 w-10 rounded-lg object-cover ring-2 ring-cyan-500/20" />
                  <span className="font-medium">{product.name}</span>
                </div>
              </td>
              <td className="p-4 text-emerald-400 font-semibold">{formatPrice(product.price)}</td>
              <td className="p-4">{product.stock}</td>
              <td className="p-4">
                {product.featured ? (
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">★ Featured</span>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="text-cyan-400 hover:bg-cyan-500/10 rounded-lg">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product._id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
