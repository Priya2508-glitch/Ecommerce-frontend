import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-gradient">Shop</span>
            <span className="text-foreground">Verse</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-violet-200 bg-white/80 focus:ring-primary/30"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  active
                    ? 'gradient-primary text-white shadow-md'
                    : 'text-muted-foreground hover:text-primary hover:bg-violet-light',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl hover:bg-violet-light transition-colors group"
          >
            <ShoppingCart className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full gradient-accent text-white text-xs font-bold flex items-center justify-center shadow-md">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated() ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/account">
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <User className="h-4 w-4 text-violet-600" />
                  {user?.name.split(' ')[0]}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-xl">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-xl">Sign Up</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-violet-100 bg-white/95 p-4 space-y-3">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-2.5 px-3 rounded-lg text-sm font-semibold hover:bg-violet-light"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated() ? (
            <>
              <Link to="/account" className="block py-2.5 px-3 rounded-lg text-sm hover:bg-violet-light" onClick={() => setMobileOpen(false)}>
                Account
              </Link>
              <button onClick={handleLogout} className="block py-2.5 px-3 rounded-lg text-sm text-destructive w-full text-left">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl">Login</Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
