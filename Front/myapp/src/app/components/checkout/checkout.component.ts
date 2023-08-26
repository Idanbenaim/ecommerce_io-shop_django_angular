// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
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
    private authService: AuthService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getCartSummary().total;
  }

  goBack(): void {
    this.router.navigate(['/albums']);
  }

  handlePayment(order: any): void {
    // console.log('Payment Approved: ', order);

    const userId = this.authService.getUserId();
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
