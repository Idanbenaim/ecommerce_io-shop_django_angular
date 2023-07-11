// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { CartService } from '../../services/cart.service';
import { Customer } from '../../models/customer';
import { CartItem } from '../../models/cart-item';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  customerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    custPhone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private customerService: CustomerService, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
  }

  onSubmit(): void {
    const customer: Customer = {
      firstName: this.customerForm.value.firstName!,
      lastName: this.customerForm.value.lastName!,
      custPhone: this.customerForm.value.custPhone!,
      email: this.customerForm.value.email!,
      address: this.customerForm.value.address!,
      city: this.customerForm.value.city!,
      state: this.customerForm.value.state!,
      zipcode: this.customerForm.value.zipcode!
    };
    this.customerService.createCustomer(customer).subscribe({
      next: res => {
        console.log(res);
        // handle response here. Possibly navigate to the next step
      },
      error: err => {
        console.log(err);
        // handle error here. Showing error message to user
      }
    });
  }

}
