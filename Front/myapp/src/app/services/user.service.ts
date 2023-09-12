// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private cartIdSubject = new BehaviorSubject<number | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null); // Add token subject
  private headers: HttpHeaders = new HttpHeaders();


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

  getToken(): string {
    return localStorage.getItem('token') || "";
  }

  // setToken(token: string): void { // Method to set the token
  //   this.tokenSubject.next(token);

  //   // Update headers whenever the token changes
  //   this.headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  // }

  // getToken(): Observable<string | null> { // Observable to get the token
  //   return this.tokenSubject.asObservable();
  // }

  // getHeaders(): HttpHeaders {
  //   return this.headers;
  // }
}



// // user.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import jwt_decode from 'jwt-decode';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private userIdSubject = new BehaviorSubject<number | null>(null);
//   private cartIdSubject = new BehaviorSubject<number | null>(null);
// ;

//   setUserIdFromToken(token: string): void {
//     const decodedToken = jwt_decode<any>(token);
//     const userId = decodedToken.user_id;
//     this.userIdSubject.next(userId);
//     console.log('set User id !!!!!!!!:', userId);
//   }

//   getUserId(): Observable<number | null> {
//     return this.userIdSubject.asObservable();
//   }

//   setCartIdFromToken(token: string): void {
//     const decodedToken = jwt_decode<any>(token);
//     const cartId = decodedToken.cart_id;
//     this.cartIdSubject.next(cartId);
//     console.log('set cart id !!!!!!!!:', cartId);
//   }

//   getCartId(): Observable<number | null > {
//     return this.cartIdSubject.asObservable();
//   }

//   getToken(): string {
//     return localStorage.getItem('token') || "";
//   }
// }
