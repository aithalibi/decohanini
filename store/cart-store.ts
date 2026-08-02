import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant } from '../types/product';
import type { CartColorSelection, CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant, color?: string) => void;
  removeItem: (productId: string, variantId?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string, color?: string) => void;
  updateColor: (productId: string, previousColor: string | undefined, nextColor: string, variantId?: string) => void;
  addColorSelection: (productId: string, color: string, variantId?: string, quantity?: number) => void;
  updateColorSelectionQuantity: (productId: string, color: string, quantity: number, variantId?: string) => void;
  removeColorSelection: (productId: string, color: string, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
}

function normalizeColor(value?: string): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getSelections(item: CartItem): CartColorSelection[] {
  if (Array.isArray(item.colorSelections) && item.colorSelections.length > 0) {
    return item.colorSelections
      .map((selection) => ({
        color: normalizeColor(selection.color),
        quantity: Number(selection.quantity) || 0,
      }))
      .filter((selection) => selection.color.length > 0 && selection.quantity > 0);
  }

  const color = normalizeColor(item.color);
  if (color) {
    return [{ color, quantity: Math.max(1, item.quantity) }];
  }

  return [];
}

function withSelections(item: CartItem, selections: CartColorSelection[]): CartItem | null {
  const cleanedSelections = selections
    .map((selection) => ({
      color: normalizeColor(selection.color),
      quantity: Math.max(0, Math.floor(Number(selection.quantity) || 0)),
    }))
    .filter((selection) => selection.color.length > 0 && selection.quantity > 0);

  if (cleanedSelections.length === 0) {
    return null;
  }

  const quantity = cleanedSelections.reduce((sum, selection) => sum + selection.quantity, 0);
  return {
    ...item,
    quantity,
    colorSelections: cleanedSelections,
    color: cleanedSelections.length === 1 ? cleanedSelections[0].color : item.color,
  };
}

function sameItem(item: CartItem, productId: string, variantId?: string) {
  return item.product.id === productId && item.variant?.id === variantId;
}

function clampQuantity(quantity: number, maxQuantity: number) {
  return Math.max(1, Math.min(Math.floor(quantity), maxQuantity));
}

function getMaxStock(item: CartItem) {
  return item.variant?.stock ?? item.product.stock ?? 20;
}

function mergeDuplicateItems(items: CartItem[]): CartItem[] {
  const merged: CartItem[] = [];

  for (const item of items) {
    const selections = getSelections(item);
    if (selections.length > 0) {
      const keyIndex = merged.findIndex((entry) => sameItem(entry, item.product.id, item.variant?.id));
      if (keyIndex === -1) {
        merged.push(withSelections(item, selections) ?? item);
        continue;
      }

      const existing = merged[keyIndex];
      const existingSelections = getSelections(existing);
      const nextSelections = [...existingSelections];

      for (const selection of selections) {
        const selectionIndex = nextSelections.findIndex((entry) => entry.color === selection.color);
        if (selectionIndex === -1) {
          nextSelections.push(selection);
          continue;
        }

        nextSelections[selectionIndex] = {
          ...nextSelections[selectionIndex],
          quantity: nextSelections[selectionIndex].quantity + selection.quantity,
        };
      }

      merged[keyIndex] = withSelections(existing, nextSelections) ?? existing;
      continue;
    }

    const existingIndex = merged.findIndex((entry) => sameItem(entry, item.product.id, item.variant?.id) && !getSelections(entry).length);
    if (existingIndex === -1) {
      merged.push(item);
      continue;
    }

    merged[existingIndex] = {
      ...merged[existingIndex],
      quantity: Math.min(
        merged[existingIndex].quantity + item.quantity,
        getMaxStock(merged[existingIndex])
      ),
    };
  }

  return merged;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1, variant, color) => {
        const currentItems = get().items;
        const availableStock = variant?.stock ?? product.stock ?? 20;
        if (availableStock <= 0) return;

        const normalizedQuantity = clampQuantity(quantity, availableStock);
        const hasColorChoices = !variant && Array.isArray(product.colors) && product.colors.length > 0;
        const targetColor = normalizeColor(color) || (hasColorChoices ? normalizeColor(product.colors?.[0]) : '');

        const updatedItems = [...currentItems];
        const existingIndex = updatedItems.findIndex((item) => sameItem(item, product.id, variant?.id));

        if (hasColorChoices) {
          if (!targetColor) return;

          if (existingIndex === -1) {
            updatedItems.push({
              product,
              variant,
              quantity: normalizedQuantity,
              color: targetColor,
              colorSelections: [{ color: targetColor, quantity: normalizedQuantity }],
            });
            set({ items: updatedItems, isOpen: true });
            return;
          }

          const existingItem = updatedItems[existingIndex];
          const selections = getSelections(existingItem);
          const selectionIndex = selections.findIndex((entry) => entry.color === targetColor);

          if (selectionIndex === -1) {
            selections.push({ color: targetColor, quantity: normalizedQuantity });
          } else {
            selections[selectionIndex] = {
              ...selections[selectionIndex],
              quantity: clampQuantity(selections[selectionIndex].quantity + normalizedQuantity, availableStock),
            };
          }

          const nextItem = withSelections(existingItem, selections);
          if (nextItem) {
            updatedItems[existingIndex] = nextItem;
          }
          set({ items: mergeDuplicateItems(updatedItems), isOpen: true });
          return;
        }

        if (existingIndex === -1) {
          updatedItems.push({ product, variant, color: targetColor || undefined, quantity: normalizedQuantity });
        } else {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: clampQuantity(updatedItems[existingIndex].quantity + normalizedQuantity, availableStock),
          };
        }

        set({ items: mergeDuplicateItems(updatedItems), isOpen: true });
      },
      removeItem: (productId, variantId, color) => {
        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) => {
            if (!sameItem(item, productId, variantId)) return item;

            const normalizedColor = normalizeColor(color);
            if (!normalizedColor) return null;

            const selections = getSelections(item);
            if (selections.length === 0) {
              return item.color === normalizedColor ? null : item;
            }

            const nextSelections = selections.filter((selection) => selection.color !== normalizedColor);
            return withSelections(item, nextSelections);
          })
          .filter((item): item is CartItem => Boolean(item));

        set({ items: updatedItems });
      },
      updateQuantity: (productId, quantity, variantId, color) => {
        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) => {
            if (!sameItem(item, productId, variantId)) return item;

            const availableStock = getMaxStock(item);
            const normalizedColor = normalizeColor(color);
            const selections = getSelections(item);

            if (normalizedColor && selections.length > 0) {
              const nextSelections = selections.map((selection) =>
                selection.color === normalizedColor
                  ? { ...selection, quantity: clampQuantity(quantity, availableStock) }
                  : selection
              );
              return withSelections(item, nextSelections);
            }

            if (normalizedColor && item.color === normalizedColor && selections.length === 0) {
              return { ...item, quantity: clampQuantity(quantity, availableStock) };
            }

            if (selections.length > 0) {
              const nextSelections = [...selections];
              nextSelections[0] = { ...nextSelections[0], quantity: clampQuantity(quantity, availableStock) };
              return withSelections(item, nextSelections);
            }

            return { ...item, quantity: clampQuantity(quantity, availableStock) };
          })
          .filter((item): item is CartItem => Boolean(item));

        set({ items: updatedItems });
      },
      updateColor: (productId, previousColor, nextColor, variantId) => {
        const normalizedPrevious = normalizeColor(previousColor);
        const normalizedNext = normalizeColor(nextColor);
        if (!normalizedNext) return;

        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) => {
            if (!sameItem(item, productId, variantId)) return item;

            const selections = getSelections(item);
            if (selections.length === 0) {
              if (!normalizedPrevious || item.color !== normalizedPrevious) return item;
              return { ...item, color: normalizedNext };
            }

            const nextSelections = selections.map((selection) =>
              selection.color === normalizedPrevious
                ? { ...selection, color: normalizedNext }
                : selection
            );
            return withSelections(item, nextSelections);
          })
          .filter((item): item is CartItem => Boolean(item));

        set({ items: mergeDuplicateItems(updatedItems) });
      },
      addColorSelection: (productId, color, variantId, quantity = 1) => {
        const normalizedColor = normalizeColor(color);
        if (!normalizedColor) return;

        const currentItems = get().items;
        const updatedItems = currentItems.map((item) => {
          if (!sameItem(item, productId, variantId)) return item;

          const availableStock = getMaxStock(item);
          const selections = getSelections(item);
          const selectionIndex = selections.findIndex((entry) => entry.color === normalizedColor);
          if (selectionIndex === -1) {
            selections.push({ color: normalizedColor, quantity: clampQuantity(quantity, availableStock) });
          } else {
            selections[selectionIndex] = {
              ...selections[selectionIndex],
              quantity: clampQuantity(selections[selectionIndex].quantity + quantity, availableStock),
            };
          }

          return withSelections(item, selections);
        });

        set({ items: mergeDuplicateItems(updatedItems.filter((item): item is CartItem => Boolean(item))) });
      },
      updateColorSelectionQuantity: (productId, color, quantity, variantId) => {
        const normalizedColor = normalizeColor(color);
        if (!normalizedColor) return;

        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) => {
            if (!sameItem(item, productId, variantId)) return item;

            const selections = getSelections(item);
            if (selections.length === 0) {
              if (item.color === normalizedColor) {
                return { ...item, quantity: clampQuantity(quantity, getMaxStock(item)) };
              }
              return item;
            }

            const nextSelections = selections.map((selection) =>
              selection.color === normalizedColor
                ? { ...selection, quantity: clampQuantity(quantity, getMaxStock(item)) }
                : selection
            );
            return withSelections(item, nextSelections);
          })
          .filter((item): item is CartItem => Boolean(item));

        set({ items: mergeDuplicateItems(updatedItems) });
      },
      removeColorSelection: (productId, color, variantId) => {
        const normalizedColor = normalizeColor(color);
        if (!normalizedColor) return;

        const currentItems = get().items;
        const updatedItems = currentItems
          .map((item) => {
            if (!sameItem(item, productId, variantId)) return item;

            const selections = getSelections(item);
            if (selections.length === 0) {
              return item.color === normalizedColor ? null : item;
            }

            return withSelections(
              item,
              selections.filter((selection) => selection.color !== normalizedColor)
            );
          })
          .filter((item): item is CartItem => Boolean(item));

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
