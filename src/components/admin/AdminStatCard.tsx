import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Animated } from '@/components/ui/Animated';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  stagger?: 1 | 2 | 3 | 4;
}

export function AdminStatCard({ title, value, icon: Icon, gradient, stagger }: AdminStatCardProps) {
  return (
    <Animated animation="scale-in" stagger={stagger}>
      <div className={cn('relative overflow-hidden rounded-2xl p-6 text-white shadow-xl', gradient)}>
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 animate-pulse-glow" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5 animate-float" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
            <p className="text-3xl font-extrabold tracking-tight">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </Animated>
  );
}
