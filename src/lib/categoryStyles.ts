export const categoryGradients: Record<string, { bg: string; icon: string; border: string }> = {
  Electronics: {
    bg: 'from-violet-500 to-purple-600',
    icon: '⚡',
    border: 'border-violet-200 hover:border-violet-400',
  },
  Clothing: {
    bg: 'from-pink-500 to-rose-600',
    icon: '👕',
    border: 'border-pink-200 hover:border-pink-400',
  },
  'Home & Garden': {
    bg: 'from-emerald-500 to-teal-600',
    icon: '🏡',
    border: 'border-emerald-200 hover:border-emerald-400',
  },
  Sports: {
    bg: 'from-orange-500 to-amber-600',
    icon: '⚽',
    border: 'border-orange-200 hover:border-orange-400',
  },
  Books: {
    bg: 'from-indigo-500 to-blue-600',
    icon: '📚',
    border: 'border-indigo-200 hover:border-indigo-400',
  },
};

export const defaultCategoryStyle = {
  bg: 'from-violet-500 to-fuchsia-600',
  icon: '🛍️',
  border: 'border-violet-200 hover:border-violet-400',
};

export function getCategoryStyle(name: string) {
  return categoryGradients[name] ?? defaultCategoryStyle;
}
