import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '../types/product';
import { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1, variant) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id && item.variant?.id === variant?.id
        );
        const availableStock = variant?.stock ?? product.stock;
        if (availableStock !== undefined && availableStock <= 0) return;

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.product.id === product.id && item.variant?.id === variant?.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, availableStock ?? 20) }
              : item
          );
          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [...currentItems, { product, variant, quantity: Math.min(quantity, availableStock ?? 20) }],
            isOpen: true,
          });
        }
      },
      removeItem: (productId, variantId) => {
        const currentItems = get().items;
        const updatedItems = currentItems.filter(
          (item) => !(item.product.id === productId && item.variant?.id === variantId)
        );
        set({ items: updatedItems });
      },
      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        const currentItems = get().items;
        const updatedItems = currentItems.map((item) =>
          item.product.id === productId && item.variant?.id === variantId
            ? { ...item, quantity: Math.min(quantity, item.variant?.stock ?? item.product.stock ?? 20) }
            : item
        );
        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: (open) => {
        const currentOpen = get().isOpen;
        set({ isOpen: open !== undefined ? open : !currentOpen });
      },
    }),
    {
      name: 'deco-hanini-cart',
    }
  )
);
