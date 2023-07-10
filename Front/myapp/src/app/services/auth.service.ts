import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Base URL for the API
  private MY_SERVER = BASE_API_URL;

  constructor(private http: HttpClient) { }

  // The login method will make a post request to the server with the user's username and password
  // The server should respond with a token that can be used to authenticate future requests
  login(user: Login): Observable<any> {
    const url = `${this.MY_SERVER}/auth/`;
    return this.http.post(url, user).pipe(
      tap((res: any) => {
        // The access token is stored in the local storage for future use
        localStorage.setItem('token', res.access);
      })
    );
  }

  // Method to get the token from local storage
  getToken(): string {
    return localStorage.getItem('token') || "";
  }

  // Method to remove the token from local storage
  logout(): void {
    localStorage.removeItem('token');
  }
}
