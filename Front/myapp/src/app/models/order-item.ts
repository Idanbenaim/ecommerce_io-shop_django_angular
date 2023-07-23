// order-item.ts
import { Album } from "./album";
import { Order } from "./order";

export class OrderItem {
  id: number;
  order: Order;
  album: Album;
  qty: number;

  constructor() {
    this.id = 0;
    this.order = new Order();
    this.album = new Album();
    this.qty = 0;
  }
}
