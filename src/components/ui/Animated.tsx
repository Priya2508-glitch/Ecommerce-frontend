import { cn } from '@/lib/utils';
import type { ReactNode, CSSProperties } from 'react';

type Animation =
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in';

interface AnimatedProps {
  children: ReactNode;
  className?: string;
  animation?: Animation;
  delay?: number;
  stagger?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Animated({
  children,
  className,
  animation = 'fade-in-up',
  delay,
  stagger,
}: AnimatedProps) {
  const style: CSSProperties = {};
  if (delay !== undefined) style.animationDelay = `${delay}ms`;
  if (stagger) style.animationDelay = `${stagger * 100}ms`;

  return (
    <div
      className={cn(`animate-${animation}`, stagger && `stagger-${stagger}`, className)}
      style={style}
    >
      {children}
    </div>
  );
}
