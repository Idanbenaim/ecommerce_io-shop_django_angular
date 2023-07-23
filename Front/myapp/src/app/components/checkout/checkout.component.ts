// // checkout.component.ts
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
import { OrderItemService } from '../../services/order-item.service';


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
    private orderItemService: OrderItemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getCartSummary().total;
    // this.customerForm = this._formBuilder.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   custPhone: ['', Validators.required],
    //   email: ['', Validators.required],
    //   address1: ['', Validators.required],
    //   address2: [''],
    //   city: ['', Validators.required],
    //   state: ['', Validators.required],
    //   zipcode: ['', Validators.required]
    // });
  }

  goBack(): void {
    this.router.navigate(['/albums']);
  }

  handlePayment(order: any): void {
    // console.log('Payment Approved: ', order);

    const userId = this.authService.getUserId();
    const cartItems = this.cartService.getCart();
    const orderItems = this.transformCartItemsToOrderItems(cartItems);
    // const customer = this.buildCustomer(order, userId);
    // const newOrder = this.buildOrder(order, userId, customer, orderItems);

    // this.processOrder(newOrder, orderItems);
  }

  // buildCustomer(order: any, userId: number): Customer {
  //   const payer = order.payer;
  //   const payerName = payer.name.given_name + ' ' + payer.name.surname;
  //   const payerEmail = payer.email_address;
  //   const shippingDetails = order.purchase_units[0].shipping;
  //   const payerAddress = shippingDetails.address;
  //   const addressLine1 = payerAddress.address_line_1;
  //   const addressLine2 = payerAddress.address_line_2 || 'N/A';
  //   const city = payerAddress.admin_area_2;
  //   const state = payerAddress.admin_area_1;
  //   const postalCode = payerAddress.postal_code;

  //   const customer: Customer = {
  //     firstName: payerName,
  //     lastName: payerName,
  //     addressLine1: addressLine1,
  //     addressLine2: addressLine2,
  //     city: city,
  //     state: state,
  //     zipcode: postalCode,
  //     email: payerEmail,
  //     id: 0,
  //     user: userId
  //   };

  //   console.log(customer)
  //   return customer;
  // }

  // buildOrder(order: any, userId: number, customer: Customer, orderItems: OrderItem[]): Order {
  //   const transactionId = order.purchase_units[0].payments.captures[0].id;
  //   const timestamp = order.create_time;
  //   const payerId = order.payer.payer_id;

  //   const newOrder: Order = {
  //     customer: customer.id,
  //     transaction_id: transactionId,
  //     total_amount: this.total,
  //     payer_id: payerId,
  //     id: order.id,
  //     timestamp: timestamp,
  //     currency: order.currency,
  //     user: userId,
  //     order_items: orderItems
  //   };

  //   console.log(newOrder)
  //   return newOrder;
  // }

  processOrder(newOrder: Order, orderItems: OrderItem[]): void {
    this.orderService.createOrder(newOrder).subscribe(createdOrder => {
      for (const orderItem of orderItems) {
        this.orderItemService.createOrderItem(orderItem).subscribe(() => {
          console.log('Order created successfully', createdOrder);
          this.cartService.clearCart();
          this.router.navigate(['/success']);
        });
      }
    });
  }


  transformCartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => {
      return {
        album: item.album,
        qty: item.quantity,
      } as OrderItem;
    });
  }

  handleError(message: string, error: any): void {
    console.log(message, error);
    // further error handling logic here
  }

  handlePaymentError(err: any): void {
    console.log('Payment Error: ', err);
    // Handle payment errors here
  }
}

  // getEmailErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

    // onSubmit(): void {
  //   if (this.customerForm.valid) {
  //     const customer: Customer = this.customerForm.value;
  //     this.customerService.createCustomer(customer).subscribe({
  //       next: res => {
  //         console.log(res);
  //         // handle response here. Possibly redirecting to another page
  //       },
  //       error: err => {
  //         console.log(err);
  //         // handle error here. Showing error message to user
  //       }
  //     });
  //   }
  // }
