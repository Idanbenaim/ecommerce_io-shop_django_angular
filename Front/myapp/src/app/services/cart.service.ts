// cart.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Album } from '../models/album';
import { CartItem } from '../models/cart-item';
import { Subject, BehaviorSubject, map, catchError, firstValueFrom, switchMap } from 'rxjs';
import { BASE_API_URL } from '../api.config';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AlbumPageService } from './album-page.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private MY_SERVER = BASE_API_URL;
  private cart: CartItem[] = [];
  cartUpdated = new Subject<void>();
  itemCount = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private albumPageService: AlbumPageService
  ) {
    this.loadCart();
  }

  private authToken = localStorage.getItem('token'); ///we were not sending token
  // private cartId = this.userService.getCartId();

  private loadCartFromLocalStorage(): void {
    console.log('local storage START...')
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
      console.log('Cart loaded from local storage:', this.cart);
    }
  }

  private async mergeAndUpdateLocalStorage(serverCartItems: any[]): Promise<void> {
    this.loadCartFromLocalStorage(); // Load local cart from local storage

    await Promise.all(serverCartItems.map(async (item: any) => {
      const albumId = item.album;

      // Fetch album details using AlbumPageService
      const album = await firstValueFrom(this.albumPageService.getAlbum(albumId));

      const existingCartItem = this.cart.find(cartItem => cartItem.album.id === albumId);
      if (existingCartItem) {
        existingCartItem.quantity += item.quantity;
      } else {
        this.cart.push(new CartItem(album, item.quantity));
      }
    }));

    this.saveCart(); // Save merged cart to local storage
    this.updateItemCount();
    this.cartUpdated.next();
  }

  private loadCartFromServer(userId: number): void {
    const url = `${this.MY_SERVER}/cart/`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    this.http.get<any[]>(url, { params: {}, headers: headers, observe: 'response' })
      .subscribe({
        next: async (response: any) => {
          // Extract cart_items from the response
          const cartItems = response.body[0].cart_items;

          await this.mergeAndUpdateLocalStorage(cartItems);

          // Notify other parts of your app that the cart has been updated
          this.cartUpdated.next();
        },
        error: (error: any) => {
          console.error('Error loading cart from server:', error);
        }
      });
  }

  loadCart(): void {
    const userId = this.userService.getUserId();

    if (userId) {
      console.log('User is logged in. Loading cart from server...');
      this.loadCartFromServer(userId); // Call the method to load cart from server
    } else {
      console.log('User is not logged in. Loading cart from local storage...');
      this.loadCartFromLocalStorage(); // Call the method to load cart from local storage
    }

    this.updateItemCount();
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  updateServerCart(): void {
    console.log('To The Cart and Beyond !!!!!!!!!!!')
    const userId = this.userService.getUserId();
    const cartId = this.userService.getCartId();

    console.log('userId: ', userId, 'cartId: ', cartId )

    if (userId) {
      const url = `${this.MY_SERVER}/cart/${cartId}/`;

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      });

      const cartData = this.cart.map(item => ({
        // id: item.id,
        album: item.album.id,
        quantity: item.quantity
      }));
      console.log(cartData)

      this.http.put(url, { cart: cartData }, { headers }).subscribe({
        next: () => {
          console.log('Server cart updated successfully');
        },
        error: (error: any) => {
          console.error('Error updating server cart:', error);
        }
      });
    }
  }

  // async updateServerCart(): Promise<void> {
  //   console.log('To The Cart and Beyond !!!!!!!!!!!');
  //   const userId = this.userService.getUserId();
  //   const cartId = this.userService.getCartId();

  //   console.log('userId: ', userId, 'cartId: ', cartId);

  //   if (userId && cartId) {
  //     const url = `${this.MY_SERVER}/cart/${cartId}/`;

  //     const headers = new HttpHeaders({
  //       'Authorization': `Bearer ${this.authToken}`
  //     });

  //     this.http.get<any[]>(url, { params: {}, headers: headers, observe: 'response' })
  //       .subscribe({
  //         next: async (response: any) => {
  //           try {
  //             const serverCartItems = response.body[0].cart_items;

  //             const updatedCartItems = this.cart.map(localCartItem => {
  //               const serverCartItem = serverCartItems.find(
  //                 (serverItem: any) => serverItem.album === localCartItem.album.id
  //               );

  //               if (serverCartItem) {
  //                 return {
  //                   id: serverCartItem.id,
  //                   quantity: localCartItem.quantity
  //                 };
  //               } else {
  //                 return {
  //                   album: localCartItem.album.id,
  //                   quantity: localCartItem.quantity
  //                 };
  //               }
  //             });

  //             const cartData = { cart_items: updatedCartItems };
  //             console.log(cartData);

  //             this.http.put(url, cartData, { headers })
  //               .subscribe({
  //                 next: () => {
  //                   console.log('Server cart updated successfully');
  //                 },
  //                 error: (error: any) => {
  //                   console.error('Error updating server cart:', error);
  //                 }
  //               });
  //           } catch (error) {
  //             console.error('Error updating server cart:', error);
  //           }
  //         },
  //         error: (error: any) => {
  //           console.error('Error retrieving server cart:', error);
  //         }
  //       });
  //   }
  // }

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
    // this.updateServerCart()
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
    // this.updateServerCart()
  }

  removeFromCart(album: Album): void {
    const index = this.cart.findIndex(item => item.album.id === album.id);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.cartUpdated.next();
    this.updateItemCount();
    // this.updateServerCart()
  }

  getCartSummary(): { total: number; itemCount: number } {
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

  // private loadCartFromServer(userId: number): void {
  //   const url = `${this.MY_SERVER}/cart/`;

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.authToken}`
  //   });

  //   this.http.get<any[]>(url, { params:{}, headers: headers, observe: 'response' }) ///headers: headers ,
  //     .subscribe({
  //       next: async (response: any) => {
  //         // Extract cart_items from the response
  //         const cartItems = response.body[0].cart_items;

  //         this.cart = await Promise.all(cartItems.map(async (item: any) => {
  //           const albumId = item.album;

  //           // Fetch album details using AlbumPageService
  //           const album = await firstValueFrom(this.albumPageService.getAlbum(albumId));

  //           return new CartItem(album, item.quantity);
  //         }));

  //         this.updateItemCount();
  //         // Notify other parts of your app that the cart has been updated
  //         this.cartUpdated.next();
  //       },
  //       error: (error: any) => {
  //         console.error('Error loading cart from server:', error);
  //       }
  //     });
  // }
