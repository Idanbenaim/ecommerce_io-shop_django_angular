// cart-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {
  private baseUrl = `${BASE_API_URL}/cart-item`;

  constructor(private http: HttpClient) { }

  updateCartItem(id: number, cartItem: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/${id}`, cartItem);
  }
}
