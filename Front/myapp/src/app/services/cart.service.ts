// cart.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { Album } from '../models/album';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] =[];
  cartUpdated = new EventEmitter<CartItem>();

  constructor() {
    // this.loadCart();
  }

  // loadCart(): void {
  //   const storedCart = localStorage.getItem('cart');
  //   if (storedCart) {
  //     const parsedCart = JSON.parse(storedCart);
  //     this.cart = parsedCart.map((item: any) => new CartItem(Object.assign(new Album(), item.album), item.quantity));
  //   }
  // }
  //   const storedCart = localStorage.getItem('cart');
  //   if (storedCart) {
  //     this.cart = JSON.parse(storedCart);
  //   }
  // }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  addToCart(album: Album): void {
    const item = this.cart.find(item => item.album.id === album.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cart.push(new CartItem(album, 1));
    }
    this.saveCart();
    this.cartUpdated.emit(new CartItem(album, item ? item.quantity : 1));
  }

  decrementQuantity(album: Album): void {
    const item = this.cart.find(item => item.album.id === album.id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.cartUpdated.emit(new CartItem(album, item.quantity));
    } else if (item && item.quantity === 1) {
      this.removeFromCart(album);
    }
    this.saveCart();
  }

  removeFromCart(album: Album): void {
    const index = this.cart.findIndex(item => item.album.id === album.id);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.cartUpdated.emit();
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  getCartSummary(): { total: number, itemCount: number } {
    let total = 0;
    let itemCount = 0;
    for (let item of this.cart) {
      total += item.album.price * item.quantity;
      itemCount += item.quantity;
    }
    return { total, itemCount };
  }

}
