// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { Order } from '../models/order';
import { BASE_API_URL } from 'src/app/api.config';
import { UserService } from './user.service';
import { CartItem } from '../models/cart-item';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private MY_SERVER = BASE_API_URL;
  private cart: CartItem[] = [];
  private headers: HttpHeaders;
  private authToken = localStorage.getItem('token'); ///we were not sending token
  private getCartUrl = `${this.MY_SERVER}/cart/`;
  private cartId = this.userService.getCartId();
  private updateCartUrl: string = "";
  private userId: number = 0;
  // private updateCartUrl = `${this.MY_SERVER}/cart/${this.cartId}`;
  // private userId = this.userService.getUserId();

  cartUpdated = new Subject<void>();
  itemCount = new BehaviorSubject<number>(0);

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private cartService: CartService

  ) {

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    console.log("this.headers: ", this.headers)

    this.userService.getUserId().subscribe(userId => {
      if (userId) {
        console.log('User is logged in. Loading cart from server...', userId);
        this.cartService.loadCartFromServer(userId);
      }
    });
    this.userService.getCartId().subscribe(cartId => {
      if (cartId) {
        this.updateCartUrl = `${this.MY_SERVER}/cart/${cartId}/`;
      }
    });
  }

  createOrder(order: Order): Observable<Order> {
    const url = `${this.MY_SERVER}/orders/`;
    return this.httpClient.post<Order>(url, order, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }


}



//   createOrder(order: Order): Observable<Order> {
//     return this.httpClient.post<Order>(this.BASE_URL, order).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Error occurred while creating order', error);
//         return throwError(() => new Error('Error occurred while creating order'));
//       })
//     );
//   }

//   // the following method map the PayPal response to an Order instance
//   mapResponseToOrder(payload: any, customer: Customer): Order {
//     const order = new Order();
//     order.customer = customer.id;
//     order.transaction_id = payload.transaction_id;
//     order.timestamp = new Date(payload.timestamp);
//     order.payer_id = payload.payer_id;
//     order.total_amount = payload.total_amount;
//     order.currency = payload.currency;
//     order.user = this.authService.getUserId();
//     return order;
//   }
