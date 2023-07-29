// paypal.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
declare var paypal: any;
import { CartService } from 'src/app/services/cart.service';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_API_URL } from 'src/app/api.config';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
})
export class PaypalComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  @ViewChild('paypal', { static: true }) private paypalElement!: ElementRef;

  @Output() onApprove = new EventEmitter<Order>(); // Step 1: Explicitly define the output type for onApprove
  @Output() onError = new EventEmitter<string>(); // Step 1: Explicitly define the output type for onError

  // Step 2: Add a variable to store the authenticated user's ID
  authenticatedUserId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const { total } = this.cartService.getCartSummary();
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();

          // Step 3: Retrieve the authenticated user's ID from the authService
          // this.authenticatedUserId = this.authService.getUserId();
          this.authService.getUserId().subscribe(
            (authenticatedUserId: number) => {

              if (
                this.authenticatedUserId !== null &&
                this.authenticatedUserId !== undefined
              ) {
                // Step 4: Create an instance of the Order class and set its properties
                const newOrder = new Order();
                newOrder.user = this.authenticatedUserId;
                newOrder.firstName = order.payer.name.given_name;
                newOrder.lastName = order.payer.name.surname;
                newOrder.email = order.payer.email_address;
                newOrder.addressLine1 =
                  order.purchase_units[0].shipping.address.address_line_1;
                newOrder.addressLine2 =
                  order.purchase_units[0].shipping.address.admin_area_2;
                newOrder.city =
                  order.purchase_units[0].shipping.address.admin_area_1;
                newOrder.state =
                  order.purchase_units[0].shipping.address.admin_area_2;
                newOrder.zipcode =
                  order.purchase_units[0].shipping.address.postal_code;
                newOrder.transaction_id = order.id;
                newOrder.timestamp = new Date(order.create_time);
                newOrder.payer_id = order.payer.payer_id;
                newOrder.total_amount = parseFloat(
                  order.purchase_units[0].amount.value
                );
                newOrder.currency = order.purchase_units[0].amount.currency_code;

                // Step 5: Update the URL path to match the new URL path in Django urls.py
                const url = BASE_API_URL + '/get_user_id/';

                // Step 6: Retrieve the JWT token
                const token = this.authService.getToken();

                if (token) {
                  // Step 7: Include the authentication token in the HTTP request headers
                  const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Assuming you have a method to retrieve the auth token from the authService
                  });

                  // Step 8: Call the orderService to create the order
                  this.http
                    .post(url, newOrder, { headers })
                    .pipe(
                      catchError((error) => {
                        console.error(error);
                        return [];
                      })
                    )
                    .subscribe((response) => {
                      // You can handle the response from the backend if needed
                      console.log(response);
                      // Step 7: Emit the event with the created order data
                      this.onApprove.emit(newOrder);
                    });
                }
              } else {
                // Handle the scenario when the user is not authenticated
                console.error('User is not authenticated.');
                this.onError.emit('User is not authenticated.');
              }
            }
      )},
        onError: (err: any) => {
          this.onError.emit(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }
}


// // paypal.component.ts
// import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
// declare var paypal: any;
// import { CartService } from 'src/app/services/cart.service';
// import { Order } from 'src/app/models/order';
// import { OrderService } from 'src/app/services/order.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { catchError } from 'rxjs';


// @Component({
//   selector: 'app-paypal',
//   templateUrl: './paypal.component.html',
//   styleUrls: ['./paypal.component.css']
// })
// export class PaypalComponent implements OnInit {
//   @ViewChild('paypal', { static: true }) private paypalElement!: ElementRef;

//   @Output() onApprove = new EventEmitter();
//   @Output() onError = new EventEmitter();

//   constructor(
//     private cartService: CartService,
//     private orderService: OrderService,
//     private authService: AuthService
//   ) { }

//   ngOnInit(): void {
//     const { total } = this.cartService.getCartSummary();
//     paypal.Buttons({
//       createOrder: (data: any, actions: any) => {
//         return actions.order.create({
//           purchase_units: [{
//             amount: {
//               currency_code: 'USD',
//               value: total
//             }
//           }]
//         });
//       },
//       onApprove: async (data: any, actions: any) => {
//         const order = await actions.order.capture();
//         const userId = this.authService.getUserId();

//         if (userId) {
//           // Create an instance of the Order class and set its properties
//           const newOrder = new Order();
//           newOrder.user = userId;
//           newOrder.firstName = order.payer.name.given_name;
//           newOrder.lastName = order.payer.name.surname;
//           newOrder.email = order.payer.email_address;
//           newOrder.addressLine1 = order.purchase_units[0].shipping.address.address_line_1;
//           newOrder.addressLine2 = order.purchase_units[0].shipping.address.admin_area_2;
//           newOrder.city = order.purchase_units[0].shipping.address.admin_area_1;
//           newOrder.state = order.purchase_units[0].shipping.address.admin_area_2;
//           newOrder.zipcode = order.purchase_units[0].shipping.address.postal_code;
//           newOrder.transaction_id = order.id;
//           newOrder.timestamp = new Date(order.create_time);
//           newOrder.payer_id = order.payer.payer_id;
//           newOrder.total_amount = parseFloat(order.purchase_units[0].amount.value);
//           newOrder.currency = order.purchase_units[0].amount.currency_code;

//           this.orderService.createOrder(newOrder).pipe(
//             catchError(error => {
//               console.error(error);
//               return [];
//             })
//           ).subscribe((createdOrder) => {
//           // Emit the event with the created order data
//           this.onApprove.emit(createdOrder);
//         });
//         } else {
//           // Handle the scenario when the user is not authenticated
//           console.error('User is not authenticated.');
//           this.onError.emit('User is not authenticated.');
//         }
//       },
//       onError: (err: any) => {
//         this.onError.emit(err);
//       }
//     }).render(this.paypalElement.nativeElement);
//   }

// }
