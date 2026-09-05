import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
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
      if (data.user.role === 'admin') {
        toast.error('Please use the admin login page.');
        navigate('/admin/login');
        return;
      }
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome back!');
      navigate('/');
    },
    onError: () => toast.error('Invalid email or password'),
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        </div>
        <div className="relative text-white text-center max-w-md">
          <h2 className="text-4xl font-extrabold mb-4">Welcome Back!</h2>
          <p className="text-violet-200 text-lg leading-relaxed">
            Sign in to track orders, save favorites, and enjoy a personalized shopping experience.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-violet-50/50 to-background">
        <Card className="w-full max-w-md shadow-glow border-violet-100/80 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold">
              <span className="text-gradient">Login</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full rounded-xl" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Sign up free
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Admin?{' '}
              <Link to="/admin/login" className="font-semibold text-primary hover:underline">
                Admin Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
