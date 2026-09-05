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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: (data: RegisterForm) =>
      authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Registration failed';
      toast.error(message);
    },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-700 relative items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        </div>
        <div className="relative text-white text-center max-w-md">
          <h2 className="text-4xl font-extrabold mb-4">Join ShopVerse</h2>
          <p className="text-violet-100 text-lg leading-relaxed">
            Create your free account and unlock exclusive deals, wishlists, and faster checkout.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-fuchsia-50/50 to-background">
        <Card className="w-full max-w-md shadow-glow border-violet-100/80 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold">
              <span className="text-gradient">Create Account</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Start shopping in seconds</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
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
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full rounded-xl" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating account...' : 'Sign Up Free'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
