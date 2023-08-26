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
import jwt_decode from 'jwt-decode';


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

          // Retrieve the token
          const token = this.authService.getToken();

          if (token) {
            // Decode the token to get the user_id
            const decodedToken = jwt_decode(token) as any;
            const authenticatedUserId = decodedToken.user_id;

            // Step 4: Create an instance of the Order class and set its properties
            const newOrder = new Order();
            newOrder.user = authenticatedUserId;
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

            // console.log(newOrder)

            // Step 5: Call the createOrder() method of the OrderService class
            this.orderService.createOrder(newOrder).subscribe(
              (createdOrder) => {
                this.onApprove.emit(createdOrder);  // Emit the created order
              },
              (error) => {
                console.error('Error creating order:', error);
                this.onError.emit('Error creating order.');
              }
            );
          } else {
            console.error('User is not authenticated.');
            this.onError.emit('User is not authenticated.');
          }
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}
