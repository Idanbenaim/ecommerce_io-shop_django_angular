// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private MY_SERVER = BASE_API_URL;

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.MY_SERVER}/orders/`, order);
  }
}


// // order.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { catchError, Observable, throwError } from 'rxjs';
// import { Order } from '../models/order';
// import { BASE_API_URL } from 'src/app/api.config';
// import { AuthService } from './auth.service';
// import { Customer } from '../models/customer';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//   private readonly BASE_URL: string = `${BASE_API_URL}/orders`;

//   constructor(
//     private httpClient: HttpClient,
//     private authService: AuthService
//   ) { }

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
// }
