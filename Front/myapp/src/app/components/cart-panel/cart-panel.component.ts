// cart-panel.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart-item';
import { BASE_API_URL } from 'src/app/api.config';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart-panel',
  templateUrl: './cart-panel.component.html',
  styleUrls: ['./cart-panel.component.css']
})
export class CartPanelComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  @Input() isTagOpen: boolean = false;
  @Output() closePanel = new EventEmitter<void>();
  cart: CartItem[] = [];
  total: number = 0;
  itemCount: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.updateCartSummary();
    this.cartService.cartUpdated.subscribe(() => {
      this.cart = this.cartService.getCart();
      this.updateCartSummary();
    });
  }

  updateCartSummary(): void {
    const summary = this.cartService.getCartSummary();
    this.total = summary.total;
    this.itemCount = summary.itemCount;
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.album);
  }

  incrementQuantity(item: CartItem): void {
    if (item.album) {
      this.cartService.addToCart(item.album);
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.album && item.quantity > 0) {
      this.cartService.decrementQuantity(item.album);
    }
  }

  close(): void {
    this.closePanel.emit();
  }

  proceedToCheckout(): void {
    if (this.authService.isLoggedIn()) {
      // If the user is logged in, navigate to the checkout page
      this.cartService.updateServerCart();
      this.router.navigate(['/checkout']);
      this.close()
    } else {
      // If the user is not logged in, prompt the user to login and then redirect to the checkout page
      this.router.navigate(['/auth'], { queryParams: { returnUrl: '/checkout' } });
      this.close()
    }
  }
}
