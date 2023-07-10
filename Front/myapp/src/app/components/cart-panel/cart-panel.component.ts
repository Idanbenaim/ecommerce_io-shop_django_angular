// cart-panel.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Album } from 'src/app/models/album';
import { CartItem } from 'src/app/models/cart-item';
import { NavigationComponent } from '../navigation/navigation.component';
import { BASE_API_URL } from 'src/app/api.config';


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

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.cartService.cartUpdated.subscribe(() => {
      this.cart = this.cartService.getCart();
    });
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
}
