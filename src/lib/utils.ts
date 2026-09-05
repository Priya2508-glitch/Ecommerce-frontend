import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getImageUrl(path: string) {
  if (!path) return 'https://picsum.photos/seed/placeholder/600/600';
  if (path.startsWith('http')) return path;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const base = apiUrl.replace('/api/v1', '');
  return `${base}${path}`;
}
