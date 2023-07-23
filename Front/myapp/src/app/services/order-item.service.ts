// order-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { OrderItem } from '../models/order-item';
import { BASE_API_URL } from 'src/app/api.config';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private readonly BASE_URL: string = `${BASE_API_URL}/orderitems`;

  constructor(private httpClient: HttpClient) { }

  createOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.httpClient.post<OrderItem>(this.BASE_URL, orderItem).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred while creating order item', error);
        return throwError(() => new Error('Error occurred while creating order item'));
      })
    );
  }

  mapResponseToOrderItems(payload: any, order: Order): OrderItem[] {
    return payload.order_items.map((item: any) => {
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.album = item.album;
      orderItem.qty = item.qty;
      return orderItem;
    });
  }
}
