import { Product } from './product.model';

export interface CartItem {
  itemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
}

export interface Cart {
  cartId: number | null;
  items: CartItem[];
  totalAmount: number;
}
