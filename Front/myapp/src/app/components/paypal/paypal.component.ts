// paypal.component.ts
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
declare var paypal: any;
import { CartService } from 'src/app/services/cart.service';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
  @ViewChild('paypal', { static: true }) private paypalElement!: ElementRef;

  @Output() onApprove = new EventEmitter();
  @Output() onError = new EventEmitter();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const { total } = this.cartService.getCartSummary();
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: total
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture();
        const userId = this.authService.getUserId();

        if (userId) {
          // Create an instance of the Order class and set its properties
          const newOrder = new Order();
          newOrder.user = userId;
          newOrder.firstName = order.payer.name.given_name;
          newOrder.lastName = order.payer.name.surname;
          newOrder.email = order.payer.email_address;
          newOrder.addressLine1 = order.purchase_units[0].shipping.address.address_line_1;
          newOrder.addressLine2 = order.purchase_units[0].shipping.address.admin_area_2;
          newOrder.city = order.purchase_units[0].shipping.address.admin_area_1;
          newOrder.state = order.purchase_units[0].shipping.address.admin_area_2;
          newOrder.zipcode = order.purchase_units[0].shipping.address.postal_code;
          newOrder.transaction_id = order.id;
          newOrder.timestamp = new Date(order.create_time);
          newOrder.payer_id = order.payer.payer_id;
          newOrder.total_amount = parseFloat(order.purchase_units[0].amount.value);
          newOrder.currency = order.purchase_units[0].amount.currency_code;

          this.orderService.createOrder(newOrder).pipe(
            catchError(error => {
              console.error(error);
              return [];
            })
          ).subscribe((createdOrder) => {
          // Emit the event with the created order data
          this.onApprove.emit(createdOrder);
        });
        } else {
          // Handle the scenario when the user is not authenticated
          console.error('User is not authenticated.');
          this.onError.emit('User is not authenticated.');
        }
      },
      onError: (err: any) => {
        this.onError.emit(err);
      }
    }).render(this.paypalElement.nativeElement);
  }

}






// // paypal.component.ts
// import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
// declare var paypal: any;
// import { CartService } from 'src/app/services/cart.service';


// @Component({
//   selector: 'app-paypal',
//   templateUrl: './paypal.component.html',
//   styleUrls: ['./paypal.component.css']
// })
// export class PaypalComponent implements OnInit {
//   @ViewChild('paypal', { static: true }) private paypalElement!: ElementRef;


//   @Output() onApprove = new EventEmitter();
//   @Output() onError = new EventEmitter();

//   constructor(private cartService: CartService) { }

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
//         this.onApprove.emit(order);
//       },
//       onError: (err: any) => {
//         this.onError.emit(err);
//       }
//     }).render(this.paypalElement.nativeElement);
//   }

// }
