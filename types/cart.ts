import { Product, ProductVariant } from './product';

export interface CartColorSelection {
  color: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  color?: string;
  colorSelections?: CartColorSelection[];
  quantity: number;
}
