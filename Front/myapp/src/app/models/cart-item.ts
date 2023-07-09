// cart-item.ts
import { Album } from './album';

export class CartItem {
  album: Album;
  quantity: number;

  constructor(album: Album, quantity: number = 1) {
    this.album = album;
    this.quantity = quantity;
  }
}
