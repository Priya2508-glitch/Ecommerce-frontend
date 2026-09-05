import type { ReactNode } from 'react';
import { Animated } from '@/components/ui/Animated';

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <Animated animation="fade-in-up" stagger={2}>
      <div className="admin-surface rounded-2xl overflow-hidden">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left p-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Animated>
  );
}

export function AdminFormPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Animated animation="scale-in">
      <div className="mb-8 p-6 admin-surface rounded-2xl space-y-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
        <h2 className="font-bold text-lg text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse-glow" />
          {title}
        </h2>
        {children}
      </div>
    </Animated>
  );
}
