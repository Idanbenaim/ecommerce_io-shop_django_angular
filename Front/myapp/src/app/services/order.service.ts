// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, forkJoin, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { Order } from '../models/order';
import { BASE_API_URL } from 'src/app/api.config';
import { UserService } from './user.service';
import { CartItem } from '../models/cart-item';
import { CartService } from './cart.service';
import { OrderItem } from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private MY_SERVER = BASE_API_URL;
  private ORDERS_URL = `${this.MY_SERVER}/orders/`;

  private headers: HttpHeaders;
  private authToken = localStorage.getItem('token');
  private userId: number = 0;
  private userOrderIds: number[] = [];

  cartUpdated = new Subject<void>();
  itemCount = new BehaviorSubject<number>(0);

  // private cart: CartItem[] = [];
  // private getCartUrl = `${this.MY_SERVER}/cart/`;
  // private cartId = this.userService.getCartId();
  // private updateCartUrl: string = "";
  // private updateCartUrl = `${this.MY_SERVER}/cart/${this.cartId}`;
  // private userId = this.userService.getUserId();

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
    // this.userService.getCartId().subscribe(cartId => {
    //   if (cartId) {
    //     this.updateCartUrl = `${this.MY_SERVER}/cart/${cartId}/`;
    //   }
    // });
  }

  createOrder(order: Order): Observable<Order> {
    // const url = `${this.MY_SERVER}/orders/`;
    return this.httpClient.post<Order>(this.ORDERS_URL, order, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
      switchMap((createdOrder) => {
        // Clear the cart and local storage on successful order creation
        this.cartService.clearCart();
        return of(createdOrder);
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    console.log('Calling getAllOrders');
    return this.httpClient.get<Order[]>(this.ORDERS_URL, { headers: this.headers }).pipe(
      tap(data => {
        console.log('getAllOrders response:', data); // Log the data returned by the request
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getAllOrders:', error);
        return throwError(() => error);
      })
    );
  }

  // getOrder(orderId: number): Observable<Order> {
  //   // const orderUrl = `${this.ORDERS_URL}${orderId}/`;
  //   return this.httpClient.get<Order>(this.ORDERS_URL{ orderId } /, { headers: this.headers }).pipe(
  //     tap(data => {
  //       console.log(`getOrder response for order ID ${orderId}:`, data); // Log the data returned by the request
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       console.error(`Error in getOrder for order ID ${orderId}:`, error);
  //       return throwError(() => error);
  //     })
  //   );
  // }


  getOrderDetails(orderId: number): Observable<Order> {
    const url = `${this.MY_SERVER}/orders/${orderId}/`;
    console.log(`Getting order details for order ID ${orderId}...`);

    return this.httpClient.get<Order>(url, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error getting order details: ${error.message}`);
        return throwError(() => error);
      })
    );
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    const url = `${this.MY_SERVER}/orderitems/?order_id=${orderId}`;
    console.log(`Getting order items for order ID ${orderId}...`);

    return this.httpClient.get<OrderItem[]>(url, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error getting order items: ${error.message}`);
        return throwError(() => error);
      })
    );
  }

  getUserOrderIds(userId: number): Observable<number[]> {
    const url = `${this.MY_SERVER}/orders/?user_id=${userId}`;
    console.log(`Getting order IDs for user ID ${userId}...`);

    return this.httpClient.get<number[]>(url, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error getting user order IDs: ${error.message}`);
        return throwError(() => error);
      }),
      tap(orderIds => {
        console.log(`User order IDs retrieved: ${orderIds}`);
        this.userOrderIds = orderIds; // Cache the retrieved order IDs
      })
    );
  }

  // Example method to get order history
  getOrderHistory(userId: number): Observable<Order[]> {
    return this.getUserOrderIds(userId).pipe(
      switchMap(orderIds => {
        const orderRequests = orderIds.map(orderId => this.getOrderDetails(orderId));
        return forkJoin(orderRequests);
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
