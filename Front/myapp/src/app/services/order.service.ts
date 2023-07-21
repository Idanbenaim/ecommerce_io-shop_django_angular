// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { BASE_API_URL } from 'src/app/api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly BASE_URL: string = `${BASE_API_URL}/orders`;

  constructor(private httpClient: HttpClient) { }

  createOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.BASE_URL, order);
  }
}
