// cart.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { Album } from '../models/album';
import { CartItem } from '../models/cart-item';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];
  cartUpdated = new Subject<void>();
  itemCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      this.cart = parsedCart.map((item: any) => {
        const album = new Album();
        album.id = item.album.id;
        album.album_title = item.album.name;
        album.artist = item.album.artist;
        album.price = item.album.price;
        album.description = item.album.description;
        album.album_cover = item.album.album_cover;

        return new CartItem(album, item.quantity);
      });
    }
    this.updateItemCount();
  }

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
    this.cartUpdated.next();
    this.updateItemCount();
  }

  decrementQuantity(album: Album): void {
    const item = this.cart.find(item => item.album.id === album.id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.cartUpdated.next();
    } else if (item && item.quantity === 1) {
      this.removeFromCart(album);
    }
    this.saveCart();
    this.updateItemCount();
  }

  removeFromCart(album: Album): void {
    const index = this.cart.findIndex(item => item.album.id === album.id);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.cartUpdated.next();
    this.updateItemCount();
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
    return { total: parseFloat(total.toFixed(2)), itemCount };
  }

  private updateItemCount(): void {
    this.itemCount.next(this.cart.reduce((count, item) => count + item.quantity, 0));
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
    this.cartUpdated.next();
    this.updateItemCount();
  }

}
