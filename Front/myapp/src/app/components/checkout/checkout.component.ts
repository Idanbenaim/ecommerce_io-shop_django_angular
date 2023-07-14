// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { CartService } from '../../services/cart.service';
import { Customer } from '../../models/customer';
import { CartItem } from '../../models/cart-item';
import { Router } from '@angular/router';
import { BASE_API_URL } from 'src/app/api.config';


import { Location } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  isLinear = false;
  customerForm: FormGroup = new FormGroup({});
  cartItems: CartItem[] = [];
  total: number = 0;
  email = new FormControl('', [Validators.required, Validators.email]);
  custPhone = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]);

  constructor(
    private _formBuilder: FormBuilder,
    private cartService: CartService,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      custPhone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required]
    });

    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getCartSummary().total;
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      this.customerService.createCustomer(customer).subscribe({
        next: res => {
          console.log(res);
          // handle response here. Possibly redirecting to another page
        },
        error: err => {
          console.log(err);
          // handle error here. Showing error message to user
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // getPhoneErrorMessage() {
  //   if (this.custPhone.hasError('required')) {
  //     return 'You must enter a numeric value';
  //   }

  //   return this.custPhone.hasError('[0-9]{10}') ? 'Numeric values only' : '';
  // }
}




// // checkout.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { CustomerService } from '../../services/customer.service';
// import { CartService } from '../../services/cart.service';
// import { Customer } from '../../models/customer';
// import { CartItem } from '../../models/cart-item';
// import { Location } from '@angular/common';



// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {
//   isLinear = false;
//   cartItems: CartItem[] = [];
//   // cartTotal: cartTotal[] = [];
//   customerForm = this.fb.group({
//     firstName: ['', Validators.required],
//     lastName: ['', Validators.required],
//     custPhone: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     address: ['', Validators.required],
//     city: ['', Validators.required],
//     state: ['', Validators.required],
//     zipcode: ['', Validators.required]
//   });

//   constructor(private fb: FormBuilder,
//     private customerService: CustomerService,
//     private cartService: CartService,
//     private location: Location
//   ) { }

//   ngOnInit(): void {
//     this.cartItems = this.cartService.getCart();
//     // this.cartTotal = this.cartService.getCartSummary();
//   }

//   onSubmit(): void {
//     const customer: Customer = {
//       firstName: this.customerForm.value.firstName!,
//       lastName: this.customerForm.value.lastName!,
//       custPhone: this.customerForm.value.custPhone!,
//       email: this.customerForm.value.email!,
//       address: this.customerForm.value.address!,
//       city: this.customerForm.value.city!,
//       state: this.customerForm.value.state!,
//       zipcode: this.customerForm.value.zipcode!
//     };
//     this.customerService.createCustomer(customer).subscribe({
//       next: res => {
//         console.log(res);
//         // handle response here. Possibly navigate to the next step
//       },
//       error: err => {
//         console.log(err);
//         // handle error here. Showing error message to user
//       }
//     });
//   }

//   goBack() {
//     this.location.back();
//   }

// }
