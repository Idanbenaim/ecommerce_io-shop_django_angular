import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  MY_SERVER = `${BASE_API_URL}/carts`;

  constructor(private http: HttpClient) { }

  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.MY_SERVER);
  }

  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.MY_SERVER}/${id}`);
  }

  createCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.MY_SERVER, cart);
  }

  updateCart(id: number, cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.MY_SERVER}/${id}`, cart);
  }

  deleteCart(id: number): Observable<{}> {
    return this.http.delete(`${this.MY_SERVER}/${id}`);
  }
}
