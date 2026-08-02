import type { CartColorSelection, CartItem } from '@/types/cart';

export type CartCheckoutLine = {
  productId: number;
  variantId?: number;
  color?: string;
  quantity: number;
};

export function getCartItemSelections(item: CartItem): CartColorSelection[] {
  if (Array.isArray(item.colorSelections) && item.colorSelections.length > 0) {
    return item.colorSelections
      .map((selection) => ({
        color: selection.color.trim(),
        quantity: Number(selection.quantity) || 0,
      }))
      .filter((selection) => selection.color.length > 0 && selection.quantity > 0);
  }

  if (item.color) {
    const color = item.color.trim();
    if (color.length > 0) {
      return [{ color, quantity: item.quantity }];
    }
  }

  return [];
}

export function getCartItemQuantity(item: CartItem): number {
  const selections = getCartItemSelections(item);
  if (selections.length > 0) {
    return selections.reduce((sum, selection) => sum + selection.quantity, 0);
  }
  return item.quantity;
}

export function flattenCartItems(items: CartItem[]): CartCheckoutLine[] {
  return items.flatMap((item) => {
    const selections = getCartItemSelections(item);
    if (selections.length > 0) {
      return selections.map((selection) => ({
        productId: Number(item.product.id),
        variantId: item.variant ? Number(item.variant.id) : undefined,
        color: selection.color,
        quantity: selection.quantity,
      }));
    }

    return [{
      productId: Number(item.product.id),
      variantId: item.variant ? Number(item.variant.id) : undefined,
      color: item.color,
      quantity: item.quantity,
    }];
  });
}
