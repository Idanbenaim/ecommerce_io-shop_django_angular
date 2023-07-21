
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Customer } from '../../models/customer';
import { CartItem } from '../../models/cart-item';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { Router } from '@angular/router';
import { BASE_API_URL } from 'src/app/api.config';
import { HttpClient } from '@angular/common/http';
import { timestamp } from 'rxjs';

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
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) { }

    ngOnInit(): void {
    this.customerForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      custPhone: ['', Validators.required],
      email: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
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

  handlePayment(order: any): void {
    console.log('Payment Approved: ', order);
    // order object contains information about the transaction
    const payer = order.payer;
    const payerName = payer.name.given_name + ' ' + payer.name.surname;  // customer name
    const payerEmail = payer.email_address;  // customer email
    const transactionId = order.purchase_units[0].payments.captures[0].id;  // transaction id
    const timestamp = order.create_time;  // timestamp
    const payerId = payer.payer_id;  // payer id

    // New full Address
    const shippingDetails = order.purchase_units[0].shipping;
    const payerAddress = shippingDetails.address;  // shipping address

    const addressLine1 = payerAddress.address_line_1;  // street
    const addressLine2 = payerAddress.address_line_2 || 'N/A';  // street 2
    const city = payerAddress.admin_area_2;  // city
    const state = payerAddress.admin_area_1;  // state
    const postalCode = payerAddress.postal_code;  // postal code
    const country = payerAddress.country_code;

    // Get user id
    const userId = this.authService.getUserId(); // Make sure you have getUserId method in AuthService

    // Get cart items
    const cartItems = this.cartService.getCart();

    // Transform the cart items into order items
    const orderItems = cartItems.map(item => {
      return {
        album: item.album,
        qty: item.quantity,
      } as OrderItem;
    });


        // Log information for debugging
    console.log('Payer Name: ', payerName);
    console.log('Payer Email: ', payerEmail);
    console.log('Transaction ID: ', transactionId);
    console.log('Timestamp: ', timestamp);
    console.log('Payer ID: ', payerId);
    console.log('Shipping Address: ', payerAddress);
    console.log('Address Line 1: ', addressLine1);
    console.log('Address Line 2: ', addressLine2);
    console.log('City: ', city);
    console.log('State: ', state);
    console.log('Postal Code: ', postalCode);
    console.log('Country: ', country);

    // Create the new Customer based on the order details
    const customer: Customer = {
      firstName: payerName,
      lastName: payerName,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      zipcode: postalCode,
      email: payerEmail,
      id: 0,
      user: userId
    };

    // Create the new Order based on the order details
    const newOrder: Order = {
      customer: customer,
      transaction_id: transactionId,
      total_amount: this.total,
      payer_id: payerId,
      id: 0,
      timestamp: timestamp,
      currency: '',
      user: userId,
      order_items: orderItems
    };

    // Log the new Order for debugging
    console.log('New Order: ', newOrder);

    // Call the order service to create the order
    this.orderService.createOrder(newOrder).subscribe(
      response => {
        console.log('Order created successfully', response);
        this.router.navigate(['/success']);
      },
      error => {
        console.log('An error occurred while creating the order', error);
      }
    );
  }

  handlePaymentError(err: any): void {
    console.log('Payment Error: ', err);
    // Handle payment errors here
  }
}


// // checkout.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { CustomerService } from '../../services/customer.service';
// import { CartService } from '../../services/cart.service';
// import { Customer } from '../../models/customer';
// import { CartItem } from '../../models/cart-item';
// import { Order } from '../../models/order';
// import { OrderItem } from '../../models/order-item';
// import { Router } from '@angular/router';
// import { BASE_API_URL } from 'src/app/api.config';
// import { HttpClient } from '@angular/common/http';


// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {
//   BASE_API_URL = BASE_API_URL;
//   isLinear = false;
//   customerForm: FormGroup = new FormGroup({});
//   cartItems: CartItem[] = [];
//   total: number = 0;
//   email = new FormControl('', [Validators.required, Validators.email]);
//   custPhone = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]);

//   constructor(
//     private _formBuilder: FormBuilder,
//     private cartService: CartService,
//     private customerService: CustomerService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.customerForm = this._formBuilder.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       custPhone: ['', Validators.required],
//       email: ['', Validators.required],
//       address: ['', Validators.required],
//       city: ['', Validators.required],
//       state: ['', Validators.required],
//       zipcode: ['', Validators.required]
//     });

//     this.cartItems = this.cartService.getCart();
//     this.total = this.cartService.getCartSummary().total;
//   }

//   onSubmit(): void {
//     if (this.customerForm.valid) {
//       const customer: Customer = this.customerForm.value;
//       this.customerService.createCustomer(customer).subscribe({
//         next: res => {
//           console.log(res);
//           // handle response here. Possibly redirecting to another page
//         },
//         error: err => {
//           console.log(err);
//           // handle error here. Showing error message to user
//         }
//       });
//     }
//   }

//   goBack(): void {
//     this.router.navigate(['/cart']);
//   }

//   getEmailErrorMessage() {
//     if (this.email.hasError('required')) {
//       return 'You must enter a value';
//     }

//     return this.email.hasError('email') ? 'Not a valid email' : '';
//   }

//   handlePayment(order: any): void {
//     console.log('Payment Approved: ', order);

//     // order object contains information about the transaction
//     const payer = order.payer;
//     const payerName = payer.name.given_name + ' ' + payer.name.surname;  // customer name
//     const payerEmail = payer.email_address;  // customer email
//     const transactionId = order.purchase_units[0].payments.captures[0].id;  // transaction id
//     const timestamp = order.create_time;  // timestamp
//     const payerId = payer.payer_id;  // payer id

//     // New full Address
//     const shippingDetails = order.purchase_units[0].shipping;
//     const payerAddress = shippingDetails.address;  // shipping address

//     const addressLine1 = payerAddress.address_line_1;  // street
//     const addressLine2 = payerAddress.address_line_2 || 'N/A';  // street 2
//     const city = payerAddress.admin_area_2;  // city
//     const state = payerAddress.admin_area_1;  // state
//     const postalCode = payerAddress.postal_code;  // postal code
//     const country = payerAddress.country_code;

//     // Log information for debugging
//     console.log('Payer Name: ', payerName);
//     console.log('Payer Email: ', payerEmail);
//     console.log('Transaction ID: ', transactionId);
//     console.log('Timestamp: ', timestamp);
//     console.log('Payer ID: ', payerId);
//     console.log('Shipping Address: ', payerAddress);
//     console.log('Address Line 1: ', addressLine1);
//     console.log('Address Line 2: ', addressLine2);
//     console.log('City: ', city);
//     console.log('State: ', state);
//     console.log('Postal Code: ', postalCode);
//     console.log('Country: ', country);

//     // Create the new Customer based on the order details
//     const customer: Customer = {
//       firstName: payerName,
//       lastName: payerName,
//       addressLine1: addressLine1,
//       addressLine2: addressLine2,
//       city: city,
//       state: state,
//       zipcode: postalCode,
//       email: payerEmail,
//       id: 0,
//       user: 0
//     };

//     // Create the new Order based on the order details
//     const newOrder: Order = {
//       customer: customer,
//       transaction_id: transactionId,
//       total_amount: this.total,
//       payer_id: payerId,
//       id: 0,
//       timestamp: timestamp,
//       currency: ''
//     };

//     // Log the new Order for debugging
//     console.log('New Order: ', newOrder);
//   }


//   handlePaymentError(err: any): void {
//     console.log('Payment Error: ', err);
//     // Handle payment errors here
//   }
// }
