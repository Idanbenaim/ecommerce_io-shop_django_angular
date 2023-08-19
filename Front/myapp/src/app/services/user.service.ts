// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private cartIdSubject = new BehaviorSubject<number | null>(null);

  setUserIdFromToken(token: string): void {
    const decodedToken = jwt_decode<any>(token);
    const userId = decodedToken.user_id;
    this.userIdSubject.next(userId);
    console.log('set User id !!!!!!!!:', userId);
  }

  getUserId(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }

  setCartIdFromToken(token: string): void {
    const decodedToken = jwt_decode<any>(token);
    const cartId = decodedToken.cart_id;
    this.cartIdSubject.next(cartId);
    console.log('set cart id !!!!!!!!:', cartId);
  }

  getCartId(): Observable<number | null> {
    return this.cartIdSubject.asObservable();
  }
}



// import { Injectable } from '@angular/core';
// import jwt_decode from 'jwt-decode';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   userId: number | null = null;
//   cartId: number | null = null;

//   setUserIdFromToken(token: string): void {
//     const decodedToken = jwt_decode<any>(token);
//     this.userId = decodedToken.user_id;
//     console.log('set User id !!!!!!!!:', this.userId)
//   }

//   getUserId(): number | null {
//     console.log('getUserId!!!!!!!!:', this.userId)
//     return this.userId;
//   }

//   setCartIdFromToken(token: string): void {
//     const decodedToken = jwt_decode<any>(token);
//     this.cartId = decodedToken.cart_id;
//     console.log('set cart id !!!!!!!!:', this.cartId)
//   }

//   getCartId(): number | null {
//     console.log('getCartId!!!!!!!!:', this.cartId)
//     return this.cartId;
//   }
// }

