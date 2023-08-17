// cart.ts
import { CartItem } from './cart-item';

export class Cart {
  user_id: number;
  items: CartItem[];

  constructor(user_id: number, items: CartItem[]) {
    this.user_id = user_id;
    this.items = items;
  }
}

