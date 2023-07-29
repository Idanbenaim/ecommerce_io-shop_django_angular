// // customer.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Customer } from '../models/customer';
// import { BASE_API_URL } from '../api.config';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomerService {
//   private MY_SERVER = `${BASE_API_URL}/customers`;

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService
//   ) { }

//   getCustomer(id: number): Observable<Customer> {
//     return this.http.get<Customer>(`${this.MY_SERVER}/${id}`);
//   }

//   createCustomer(customer: Customer): Observable<Customer> {
//     return this.http.post<Customer>(this.MY_SERVER, customer);
//   }

//   updateCustomer(id: number, customer: Customer): Observable<Customer> {
//     return this.http.put<Customer>(`${this.MY_SERVER}/${id}`, customer);
//   }

//   deleteCustomer(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.MY_SERVER}/${id}`);
//   }

//   // the following method to map the PayPal response to a Customer instance
//   mapResponseToCustomer(payload: any): Customer {
//     const customer = new Customer();
//     customer.firstName = payload.customer.firstName;
//     customer.lastName = payload.customer.lastName;
//     customer.email = payload.customer.email;
//     customer.addressLine1 = payload.customer.addressLine1;
//     customer.addressLine2 = payload.customer.addressLine2;
//     customer.city = payload.customer.city;
//     customer.state = payload.customer.state;
//     customer.zipcode = payload.customer.zipcode;
//     customer.user = this.authService.getUserId();
//     return customer;
//   }

// }
