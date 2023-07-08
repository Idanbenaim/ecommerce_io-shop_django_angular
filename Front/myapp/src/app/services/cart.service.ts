// cart.service.ts
import { Injectable } from '@angular/core';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Album[] = [];

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  addToCart(album: Album): void {
    const foundAlbum = this.cart.find(item => item.id === album.id);
    if (foundAlbum) {
      foundAlbum.quantity = (foundAlbum.quantity || 0) + 1;
      console.log(foundAlbum.quantity)
    } else {
      album.quantity = 1;
      this.cart.push(album);
    }
    this.saveCart();
  }

  removeFromCart(album: Album): void {
    const foundAlbum = this.cart.find(item => item.id === album.id);
    if (foundAlbum) {
      if (foundAlbum.quantity && foundAlbum.quantity > 1) {
        foundAlbum.quantity -= 1;
      } else {
        const index = this.cart.findIndex(item => item.id === album.id);
        if (index > -1) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.saveCart();
  }

  getCart(): Album[] {
    return this.cart;
  }
}



// // cart.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Album } from '../models/album';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private cart: Album[] = [];
//   cartSubject = new BehaviorSubject<Album[]>(this.cart);

//   constructor() {
//     this.loadCart();
//   }

//   loadCart(): void {
//     const storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//       this.cart = JSON.parse(storedCart);
//     }
//   }

//   saveCart(): void {
//     localStorage.setItem('cart', JSON.stringify(this.cart));
//   }

//   addToCart(album: Album): void {
//     console.log(album)
//     this.cart.push(album);
//     this.saveCart();
//   }

//   removeFromCart(album: Album): void {
//     const index = this.cart.findIndex(item => item.id === album.id);
//     if (index > -1) {
//       this.cart.splice(index, 1);
//       this.saveCart();
//     }
//   }

//   getCart(): Album[] {
//     return this.cart;
//   }
// }

