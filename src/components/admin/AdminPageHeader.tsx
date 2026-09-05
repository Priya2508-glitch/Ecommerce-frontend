import type { ReactNode } from 'react';
import { Animated } from '@/components/ui/Animated';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <Animated animation="fade-in-down" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </Animated>
  );
}
