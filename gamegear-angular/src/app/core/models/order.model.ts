import { Product } from './product.model';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  orderId?: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
  items: OrderItem[];
}

/** Body for POST /orders/create-payment-intent. */
export interface PaymentRequest {
  amount: number;
  currency: string;
}
