import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Settings, Shield } from 'lucide-react';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.user.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    },
    onError: () => toast.error('Invalid email or password'),
  });

  return (
    <div className="admin-bg min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl gradient-teal items-center justify-center mb-4 animate-pulse-glow">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Console</h1>
          <p className="text-slate-400 mt-2">Sign in to manage ShopVerse</p>
        </div>

        <div className="admin-surface rounded-2xl p-8 border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-slate-300">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@store.com"
                {...register('email')}
                className="bg-[#0c1222] border-[#2a3548] text-white placeholder:text-slate-500"
              />
              {errors.email && (
                <p className="text-sm text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="bg-[#0c1222] border-[#2a3548] text-white placeholder:text-slate-500"
              />
              {errors.password && (
                <p className="text-sm text-rose-400 mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full gradient-teal rounded-xl border-0 text-white h-11"
            >
              <Shield className="h-4 w-4" />
              {mutation.isPending ? 'Signing in...' : 'Sign In to Admin'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Customer?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
              Go to Store Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
