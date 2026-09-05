import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestCartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}

interface CartState {
  items: GuestCartItem[];
  addItem: (item: Omit<GuestCartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
          });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' },
  ),
);
