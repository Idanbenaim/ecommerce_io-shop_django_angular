import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from 'src/app/models/cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-panel',
  templateUrl: './cart-panel.component.html',
  styleUrls: ['./cart-panel.component.css']
})
export class CartPanelComponent {
  @Input()
  isTagOpen: boolean = false;
  @Output() closePanel: EventEmitter<void> = new EventEmitter();

  cart: Cart = new Cart();

  constructor(private cartService: CartService) { }

  getCart() {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  onClose() {
    this.closePanel.emit();
  }
}



// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../services/cart.service';
// import { Cart } from 'src/app/models/cart';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-cart-panel',
//   templateUrl: './cart-panel.component.html',
//   styleUrls: ['./cart-panel.component.css']
// })
// export class CartPanelComponent implements OnInit {
//   isTagOpen: boolean = false;
//   cart: Cart = new Cart();

//   constructor(private cartService: CartService) { }

//   ngOnInit() { }

//   toggleTag() {
//     this.isTagOpen = !this.isTagOpen;
//     if (this.isTagOpen) {
//       this.getCart();
//     }
//   }

//   getCart() {
//     this.cartService.getCart().subscribe(cart => {
//       this.cart = cart;
//     });
//   }
// }

