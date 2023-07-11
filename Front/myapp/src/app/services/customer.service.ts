// customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private MY_SERVER = `${BASE_API_URL}/customers`;

  constructor(private http: HttpClient) { }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.MY_SERVER}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.MY_SERVER, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.MY_SERVER}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.MY_SERVER}/${id}`);
  }
}
