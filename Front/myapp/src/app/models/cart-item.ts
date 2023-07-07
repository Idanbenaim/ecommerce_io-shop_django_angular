import { Album } from './album';
import {Cart } from './cart';

export class CartItem {
  id: number = 0;
  cart: Cart = new Cart;
  album: Album = new Album;
  qty: number = 0;
}

