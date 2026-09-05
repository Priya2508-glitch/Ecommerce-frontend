import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';

export function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getUsers,
  });

  return (
    <div>
      <AdminPageHeader title="Users" subtitle="View registered customers and admins" />

      {isLoading ? (
        <Skeleton className="h-48 rounded-2xl bg-[#1a2236]" />
      ) : (
        <AdminTable headers={['User', 'Email', 'Role']}>
          {users?.map((user, i) => (
            <tr key={user.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                    user.role === 'admin'
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500'
                      : 'bg-gradient-to-br from-violet-500 to-purple-600'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>
              </td>
              <td className="p-4 text-slate-400">{user.email}</td>
              <td className="p-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  user.role === 'admin'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                }`}>
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
