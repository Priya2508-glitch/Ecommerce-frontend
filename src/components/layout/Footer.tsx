import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-br from-[#1e1b2e] via-[#2d1f5e] to-[#4c1d95] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
              </div>
              <span className="text-xl font-extrabold">ShopVerse</span>
            </div>
            <p className="text-sm text-violet-200/80 leading-relaxed">
              Your vibrant destination for quality products. Discover trends, express your style.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-fuchsia-200">Shop</h4>
            <ul className="space-y-2.5 text-sm text-violet-200/80">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-fuchsia-200">Account</h4>
            <ul className="space-y-2.5 text-sm text-violet-200/80">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-fuchsia-200">Support</h4>
            <ul className="space-y-3 text-sm text-violet-200/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-fuchsia-300 shrink-0" />
                support@shopverse.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-fuchsia-300 shrink-0" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-violet-300/60">
          <span>&copy; {new Date().getFullYear()} ShopVerse. All rights reserved.</span>
          <span>Made with 💜 for modern shoppers</span>
        </div>
      </div>
    </footer>
  );
}
