import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { categoriesApi } from '@/api';
import type { Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, AdminFormPanel } from '@/components/admin/AdminTable';
import { getCategoryStyle } from '@/lib/categoryStyles';

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditing(null);
    setShowForm(false);
  };

  const createMutation = useMutation({
    mutationFn: () => categoriesApi.create(form),
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: () => categoriesApi.update(editing!._id, form),
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const handleEdit = (category: Category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description });
    setShowForm(true);
  };

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        subtitle="Organize your product catalog"
        action={
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="gradient-teal rounded-xl border-0 text-white">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      {showForm && (
        <AdminFormPanel title={editing ? 'Edit Category' : 'New Category'}>
          <div>
            <Label className="text-slate-300">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label className="text-slate-300">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => (editing ? updateMutation.mutate() : createMutation.mutate())}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="gradient-teal rounded-xl border-0 text-white"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-xl border-[#2a3548] text-slate-300">Cancel</Button>
          </div>
        </AdminFormPanel>
      )}

      {isLoading ? (
        <Skeleton className="h-48 rounded-2xl bg-[#1a2236]" />
      ) : (
        <AdminTable headers={['Category', 'Slug', 'Description', 'Actions']}>
          {categories?.map((cat, i) => {
            const style = getCategoryStyle(cat.name);
            return (
              <tr key={cat._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-9 w-9 rounded-lg bg-gradient-to-br ${style.bg} flex items-center justify-center text-lg`}>
                      {style.icon}
                    </span>
                    <span className="font-semibold">{cat.name}</span>
                  </div>
                </td>
                <td className="p-4 text-cyan-400 font-mono text-xs">{cat.slug}</td>
                <td className="p-4 text-slate-400 line-clamp-1 max-w-xs">{cat.description}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="text-cyan-400 hover:bg-cyan-500/10 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      onClick={() => { if (confirm('Delete this category?')) deleteMutation.mutate(cat._id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </div>
  );
}
