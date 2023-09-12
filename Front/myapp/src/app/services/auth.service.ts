// // // auth.service.ts
// // import { Injectable } from '@angular/core';
// // import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// // import { Login } from '../models/login';
// // import { Observable, of, timer, Subscription } from 'rxjs';
// // import { catchError, map, tap } from 'rxjs/operators';
// // import { Router } from '@angular/router';
// // import { BASE_API_URL } from '../api.config';
// // import jwt_decode from 'jwt-decode';
// // import { CartService } from './cart.service';
// // import { UserService } from './user.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {
// //   private MY_SERVER = BASE_API_URL;
// //   private inactivityTimer!: Subscription;
// //   headers = new HttpHeaders({
// //     'Content-Type': 'application/json',
// //   });
// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     private userService: UserService,
// //     private cartService: CartService
// //   ) { }

// //   login(user: Login): Observable<any> {
// //     const url = `${this.MY_SERVER}/auth/`;
// //     return this.http.post(url, user).pipe(
// //       tap((res: any) => {
// //         localStorage.setItem('token', res.access);

// //         this.userService.setUserIdFromToken(res.access);
// //         this.userService.setCartIdFromToken(res.access);
// //         // console.log('get User id !!!!!!!!:', this.userService.getUserId());
// //         // console.log('get cart id !!!!!!!!:', this.userService.getCartId());


// //         // use type assertion to let TypeScript know decodedToken is an object
// //         const decodedToken = jwt_decode(res.access) as any;
// //         console.log('User ID: ', decodedToken.user_id, 'Username: ', decodedToken.username); // log the user id from the decoded token

// //         this.startInactivityTimer();

// //         // Call the loadCart method after successful login
// //         this.cartService.loadCart();
// //       }),
// //       catchError((error: HttpErrorResponse) => {
// //         let errorMsg: string;
// //         if (error.error instanceof ErrorEvent) {
// //           errorMsg = `Please enter a valid username and password`;
// //         } else if (error.status === 401) {
// //           errorMsg = "Please enter a valid username and password, or proceed to create an account.";
// //         } else {
// //           errorMsg = `Please enter a valid username and password`;
// //         }
// //         return of({ error: errorMsg });
// //       })
// //     );
// //   }

// //   getToken(): string {
// //     return localStorage.getItem('token') || "";
// //   }

// //   getUserId(): Observable<number | null> {
// //     const token = this.getToken();
// //     if (!token) {
// //       // If the token is not available, return an observable with null value
// //       return of(null);
// //     }

// //     // Decode the token to get the user_id
// //     const decodedToken = jwt_decode<any>(token);

// //     // Return the user_id as an observable
// //     return of(decodedToken.user_id);
// //   }

// //   logout(): void {
// //     localStorage.removeItem('token');
// //     if (this.inactivityTimer) {
// //       this.inactivityTimer.unsubscribe();
// //     }
// //     this.router.navigate(['/auth']);
// //   }

// //   isLoggedIn(): boolean {
// //     return !!this.getToken();
// //   }

// //   register(user: Login): Observable<any> {
// //     const url = `${this.MY_SERVER}/register/`;
// //     return this.http.post(url, user);
// //   }

// //   // Start or reset inactivity timer
// //   startInactivityTimer(): void {
// //     // If there's a previous timer, clear it
// //     if (this.inactivityTimer) {
// //       this.inactivityTimer.unsubscribe();
// //     }
// //     // Start a new timer (30 minutes = 1800000 milliseconds)
// //     this.inactivityTimer = timer(1800000).subscribe(() => this.logout());
// //   }

// //   // Call this method whenever user performs an action
// //   userActivity(): void {
// //     if (this.isLoggedIn()) {
// //       this.startInactivityTimer();
// //     }
// //   }
// // }

// // auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Login } from '../models/login';
// import { Observable, of, timer, Subscription, BehaviorSubject } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { BASE_API_URL } from '../api.config';
// import jwt_decode from 'jwt-decode';

// import { CartService } from './cart.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private MY_SERVER = BASE_API_URL;
//   private authToken = localStorage.getItem('token');
//   private inactivityTimer!: Subscription;
//   private userIdSubject = new BehaviorSubject<number | null>(null);
//   private cartIdSubject = new BehaviorSubject<number | null>(null);

//   headers = new HttpHeaders({
//     'Authorization': `Bearer ${this.authToken}`,
//   });

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private cartService: CartService
//   ) { }

//   login(user: Login): Observable<any> {
//     const url = `${this.MY_SERVER}/auth/`;
//     return this.http.post(url, user).pipe(
//       tap((res: any) => {
//         localStorage.setItem('token', res.access);

//         this.setUserIdAndCartIdFromToken(res.access);

//         const decodedToken = jwt_decode(res.access) as any;
//         console.log('User ID: ', decodedToken.user_id, 'Username: ', decodedToken.username);

//         this.startInactivityTimer();

//         // Call the loadCart method after successful login
//         this.cartService.loadCart();
//       }),
//       catchError((error: HttpErrorResponse) => {
//         let errorMsg: string;
//         if (error.error instanceof ErrorEvent) {
//           errorMsg = `Please enter a valid username and password`;
//         } else if (error.status === 401) {
//           errorMsg = "Please enter a valid username and password, or proceed to create an account.";
//         } else {
//           errorMsg = `Please enter a valid username and password`;
//         }
//         return of({ error: errorMsg });
//       })
//     );
//   }

//   getToken(): string {
//     return localStorage.getItem('token') || "";
//   }

//   getUserId(): Observable<number | null> {
//     return this.userIdSubject.asObservable();
//   }

//   getCartId(): Observable<number | null> {
//     return this.cartIdSubject.asObservable();
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     if (this.inactivityTimer) {
//       this.inactivityTimer.unsubscribe();
//     }
//     this.router.navigate(['/auth']);
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   register(user: Login): Observable<any> {
//     const url = `${this.MY_SERVER}/register/`;
//     return this.http.post(url, user);
//   }

//   startInactivityTimer(): void {
//     if (this.inactivityTimer) {
//       this.inactivityTimer.unsubscribe();
//     }
//     this.inactivityTimer = timer(1800000).subscribe(() => this.logout());
//   }

//   userActivity(): void {
//     if (this.isLoggedIn()) {
//       this.startInactivityTimer();
//     }
//   }

//   private setUserIdAndCartIdFromToken(token: string): void {
//     const decodedToken = jwt_decode<any>(token);
//     this.userIdSubject.next(decodedToken.user_id);
//     this.cartIdSubject.next(decodedToken.cart_id);
//   }
// }

// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../models/login';
import { Observable, of, timer, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BASE_API_URL } from '../api.config';
import jwt_decode from 'jwt-decode';
import { CartService } from './cart.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private MY_SERVER = BASE_API_URL;
  private inactivityTimer!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private cartService: CartService
  ) { }
  login(user: Login): Observable<any> {
    const url = `${this.MY_SERVER}/auth/`;
    return this.http.post(url, user).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.access);
        this.userService.setUserIdFromToken(res.access);
        this.userService.setCartIdFromToken(res.access);
        // use type assertion to let TypeScript know decodedToken is an object
        const decodedToken = jwt_decode(res.access) as any;
        console.log('User ID: ', decodedToken.user_id, 'Username: ', decodedToken.username); // log the user id from the decoded token
        // this.startInactivityTimer();
        // Call the loadCart method after successful login
        this.cartService.loadCart();
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Please enter a valid username and password`;
        } else if (error.status === 401) {
          errorMsg = "Please enter a valid username and password, or proceed to create an account.";
        } else {
          errorMsg = `Please enter a valid username and password`;
        }
        return of({ error: errorMsg });
      })
    );
  }
  getToken(): string {
    return localStorage.getItem('token') || "";
  }
  getUserId(): Observable<number | null> {
    const token = this.getToken();
    if (!token) {
      // If the token is not available, return an observable with null value
      return of(null);
    }
    // Decode the token to get the user_id
    const decodedToken = jwt_decode<any>(token); // Ensure you have imported `jwt_decode` at the top of the AuthService file.
    // Return the user_id as an observable
    return of(decodedToken.user_id);
  }
  logout(): void {
    localStorage.removeItem('token');
    // if (this.inactivityTimer) {
    //   this.inactivityTimer.unsubscribe();
    // }
    this.router.navigate(['/auth']);
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  register(user: Login): Observable<any> {
    const url = `${this.MY_SERVER}/register/`;
    return this.http.post(url, user);
  }
  // // Start or reset inactivity timer
  // startInactivityTimer(): void {
  //   // If there's a previous timer, clear it
  //   if (this.inactivityTimer) {
  //     this.inactivityTimer.unsubscribe();
  //   }
  //   // Start a new timer (30 minutes = 1800000 milliseconds)
  //   this.inactivityTimer = timer(1800000).subscribe(() => this.logout());
  // }
  // // Call this method whenever user performs an action
  // userActivity(): void {
  //   if (this.isLoggedIn()) {
  //     this.startInactivityTimer();
  //   }
  // }
}
