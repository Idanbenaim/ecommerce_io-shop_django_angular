// cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Album } from '../models/album';
import { CartItem } from '../models/cart-item';
import { Subject, BehaviorSubject, map, catchError, firstValueFrom, Observable, throwError, timer, switchMap } from 'rxjs';
import { BASE_API_URL } from '../api.config';
import { UserService } from './user.service';
import { AlbumPageService } from './album-page.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private MY_SERVER = BASE_API_URL;
  private cart: CartItem[] = [];
  private headers: HttpHeaders | undefined;
  private authToken = localStorage.getItem('token');
  // private authToken = this.userService.getToken();
  private getCartUrl = `${this.MY_SERVER}/cart/`;
  private cartId = this.userService.getCartId();
  private updateCartUrl = `${this.MY_SERVER}/cart/${this.cartId}`;
  private userId = this.userService.getUserId();
  cartUpdated = new Subject<void>();
  itemCount = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private albumPageService: AlbumPageService,
  ) {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    console.log("this.headers: ", this.headers)

    this.userService.getUserId().subscribe(userId => {
      if (userId) {
        console.log('User is logged in. Loading cart from server...', userId);
        this.loadCartFromServer();
      } else {
        console.log('User is not logged in. Loading cart from local storage...');
        this.loadCartFromLocalStorage();
      }
      this.updateItemCount();
    });
    this.userService.getCartId().subscribe(cartId => {
      if (cartId) {
        this.updateCartUrl = `${this.MY_SERVER}/cart/${cartId}/`;
      }
    });
    ////////////////////
    // this.loadCart();
  }

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
  //// gets the cart items from the database//////////////////////////////
  private fetchServerCartItems(getCartUrl: string): Observable<any[]> {
    this.authToken = this.userService.getToken(),
      this.headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      });
    console.log("fetchServerCartItems START!!!!!!!!!!!!!!",
      "this.authToken: ", this.authToken,
      "this.headers: ", this.headers,
    )
    return this.http.get<any[]>(getCartUrl, { params: {}, headers: this.headers, observe: 'response' })
      .pipe(
        map(response => {
          if (response.body && response.body.length > 0) {
            console.log("response.body: ", response.body)
            return response.body[0].cart_items;
          } else {
            return [];
          }
        }),
        catchError(error => {
          console.error('Error retrieving server cart:', error);
          return throwError(() => error);
        })
        // );
        //   })
      );
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
  loadCart(): void {
    // const userId = this.userService.getUserId();
    console.log('userId: ', this.userId)
    if (this.userId) {
      console.log('User is logged in. Loading cart from server...');
      this.loadCartFromServer(); // Call the method to load cart from server
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
  // calls fetchServerCartItems to get the cart item id,
  // with the album id and quantity, then compares database cart items
  // to local cart items and updates the database cart items
  async updateServerCart(): Promise<void> {
    console.log('To The Cart and Beyond !!!!!!!!!!!');
    console.log('userId: ', this.userId, 'cartId: ', this.cartId);
    if (this.userId && this.cartId) {
      // const url = `${this.MY_SERVER}/cart/${cartId}/`;
      this.fetchServerCartItems(this.getCartUrl)
        .subscribe({
          next: async (serverCartItems: any[]) => {
            const updatedCartItems = this.cart.map(localCartItem => {
              const serverCartItem = serverCartItems.find(
                serverItem => serverItem.album === localCartItem.album.id
              );
              if (serverCartItem) {
                return {
                  id: serverCartItem.id,
                  quantity: localCartItem.quantity
                };
              } else {
                return {
                  album: localCartItem.album.id,
                  quantity: localCartItem.quantity
                };
              }
            });
            // Construct an array of items to send to the server
            const itemsToUpdate = updatedCartItems.map(updatedItem => {
              return updatedItem.id
                ? { id: updatedItem.id, quantity: updatedItem.quantity }
                : { album: updatedItem.album, quantity: updatedItem.quantity };
            });
            const cartData = { cart_items: itemsToUpdate };
            console.log("cartData: ", cartData);
            console.log(this.updateCartUrl)
            this.http.put(this.updateCartUrl, cartData, { headers: this.headers })
              .subscribe({
                next: () => {
                  console.log('Server cart updated successfully');
                },
                error: (error: any) => {
                  console.error('Error updating server cart:', error);
                }
              });
          },
          error: (error: any) => {
            console.error('Error updating server cart:', error);
          }
        });
    }
  }

  // loads items from the database and
  // sends it to be merged with local storage cart items
  loadCartFromServer(): void {
    console.log('loadCartFromServer START!!!!!!!!!!!!!!', this.getCartUrl)

    this.fetchServerCartItems(this.getCartUrl)
      .subscribe({
        next: async (serverCartItems: any[]) => {
          await this.mergeAndUpdateLocalStorage(serverCartItems);
          this.cartUpdated.next();
        },
        error: (error: any) => {
          console.error('Error loading cart from server:', error);
        }
      });
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
    this.updateServerCart()
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
    this.updateServerCart()
  }
  // removes a specific item from the user's cart locally
  // and calls removeCartItemFromServer method to remove the item on the server side
  removeFromCart(album: Album): void {
    const index = this.cart.findIndex(item => item.album.id === album.id);
    if (index > -1) {
      if (this.userId) this.removeCartItemFromServer(album)
      this.cart.splice(index, 1);
    }
    this.saveCart();
    this.cartUpdated.next();
    this.updateItemCount();
  }
  // removes a specific item from the user's cart on the server side
  removeCartItemFromServer(album: Album): void {
    const albumId = album.id;
    console.log(this.updateCartUrl)
    if (this.userId) {
      this.fetchServerCartItems(this.getCartUrl).subscribe({
        next: async (serverCartItems: any[]) => {
          const serverCartItem = serverCartItems.find(
            serverItem => serverItem.album === albumId
          );
          if (serverCartItem) {
            const serverItemId = serverCartItem.id;
            this.http.delete<void>(`${this.updateCartUrl}${serverItemId}/`, { headers: this.headers })
              .pipe(
                catchError(error => {
                  console.error('Error updating server cart:', error);
                  return throwError(() => error);
                })
              )
              .subscribe({
                next: () => {
                  console.log('Server cart updated successfully');
                },
                error: (error: any) => {
                  console.error('Error updating server cart:', error);
                }
              });
          }
        },
        error: (error: any) => {
          console.error('Error retrieving server cart items:', error);
        }
      });
    }
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
