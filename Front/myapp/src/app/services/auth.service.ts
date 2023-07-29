// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../models/login';
import { Observable, of, timer, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private MY_SERVER = BASE_API_URL;
  private inactivityTimer!: Subscription;

  constructor(private http: HttpClient, private router: Router) { }

  login(user: Login): Observable<any> {
    const url = `${this.MY_SERVER}/auth/`;
    return this.http.post(url, user).pipe(
      tap((res: any) => {
        localStorage.setItem('userId', String(res.id));
        console.log(res.id)
        localStorage.setItem('token', res.access);
        console.log('token');
        this.startInactivityTimer();
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

  getUserId(): Observable<number> {
    {
      const userId = `${this.MY_SERVER}/get_user_id/`;
      console.log(userId)
      return this.http.get<{ user_id: number }>(userId).pipe(
        map(response => response.user_id)
      );
    }
  }

  getToken(): string {
    return localStorage.getItem('token') || "";
  }

  logout(): void {
    localStorage.removeItem('token');
    if (this.inactivityTimer) {
      this.inactivityTimer.unsubscribe();
    }
    this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(user: Login): Observable<any> {
    const url = `${this.MY_SERVER}/register/`;
    return this.http.post(url, user);
  }

  // Start or reset inactivity timer
  startInactivityTimer(): void {
    // If there's a previous timer, clear it
    if (this.inactivityTimer) {
      this.inactivityTimer.unsubscribe();
    }
    // Start a new timer (30 minutes = 1800000 milliseconds)
    this.inactivityTimer = timer(1800000).subscribe(() => this.logout());
  }

  // Call this method whenever user performs an action
  userActivity(): void {
    if (this.isLoggedIn()) {
      this.startInactivityTimer();
    }
  }
}



// // Auth Service
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Login } from '../models/login';
// import { Observable, of } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { BASE_API_URL } from '../api.config';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   // Base URL for the API
//   private MY_SERVER = BASE_API_URL;

//   constructor(private http: HttpClient) { }

//   // The login method will make a post request to the server with the user's username and password
//   // The server should respond with a token that can be used to authenticate future requests
//   login(user: Login): Observable<any> {
//     const url = `${this.MY_SERVER}/auth/`;
//     return this.http.post(url, user).pipe(
//       tap((res: any) => {
//         // The access token is stored in the local storage for future use
//         localStorage.setItem('token', res.access);
//       }),
//       catchError((error: HttpErrorResponse) => {
//         // create an error message string
//         let errorMsg: string;
//         if (error.error instanceof ErrorEvent) {
//           errorMsg = `Please enter a valid username and password`;
//         } else if (error.status === 401) {
//           errorMsg = "Username does not exist in our database. Please create an account.";
//         } else {
//           errorMsg = `Please enter a valid username and password`;
//         }
//         // create an observable with the error message
//         return of({ error: errorMsg });
//       })


//     );
//   }

//   // get the token from local storage
//   getToken(): string {
//     return localStorage.getItem('token') || "";
//   }

//   // remove the token from local storage
//   logout(): void {
//     localStorage.removeItem('token');
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   // registration method
//   register(user: Login): Observable<any> {
//     const url = `${this.MY_SERVER}/register/`;
//     return this.http.post(url, user);
//   }
// }
