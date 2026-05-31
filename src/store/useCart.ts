import { create } from 'zustand';
import type { CartItem, CartState } from '@/types/cart.types';

interface CartStore extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],

  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === newItem.product.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === newItem.product.id
              ? {
                  ...item,
                  quantity: item.quantity + newItem.quantity,
                }
              : item
          ),
        };
      }

      return {
        items: [...state.items, newItem],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.product.id !== productId
      ),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
}));