// cart-panel.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Album } from 'src/app/models/album';
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
  cart: Album[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
  }

  removeFromCart(album: Album): void {
    this.cartService.removeFromCart(album);
    // Refresh the cart
    this.cart = this.cartService.getCart();
  }

  close(): void {
    this.closePanel.emit();
  }
}


// import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { CartService } from '../../services/cart.service';
// import { Cart } from 'src/app/models/cart';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-cart-panel',
//   templateUrl: './cart-panel.component.html',
//   styleUrls: ['./cart-panel.component.css']
// })
// export class CartPanelComponent implements OnInit {
//   @Input()
//   isTagOpen: boolean = false;
//   @Output() closePanel: EventEmitter<void> = new EventEmitter();

//   cartItems: any[] = [];

//   constructor(private cartService: CartService) { }

//   ngOnInit(): void {
//     this.getCart();
//   }

//   getCart(): void {
//     this.cartService.getCart().subscribe(items => {
//       this.cartItems = items;
//     });
//   }

//   onClose(): void {
//     this.closePanel.emit();
//   }
// }

