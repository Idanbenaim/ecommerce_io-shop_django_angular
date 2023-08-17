// user.service.ts
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: number | null = null;
  private cartId: number | null = null;

  setUserIdFromToken(token: string): void {
    const decodedToken = jwt_decode<any>(token);
    this.userId = decodedToken.user_id;
  }

  getUserId(): number | null {
    return this.userId;
  }

  setCartIdFromToken(token: string): void {
    const decodedToken = jwt_decode<any>(token);
    this.cartId = decodedToken.cart_id;
    console.log('set!!!!!!!!:', this.cartId)
  }

  getCartId(): number | null {
    console.log('get!!!!!!!!:', this.cartId)
    return this.cartId;
  }
}
