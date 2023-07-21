// order-item.ts
import { Album } from "./album";
import { Order } from "./order";

export class OrderItem {
  id: number = 0;
  order: Order = new Order();
  album: Album = new Album();
  qty: number = 0;

  // constructor() {
  //   this.id = 0;
  //   this.order = new Order();
  //   this.album = new Album();
  //   this.qty = 0;
  // }
}
