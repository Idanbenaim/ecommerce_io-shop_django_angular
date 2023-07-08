// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Album } from 'src/app/models/album';
import { BASE_API_URL } from 'src/app/api.config';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
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
}


// import { Component, OnInit } from '@angular/core';
// import { Cart } from 'src/app/models/cart';
// import { CartService } from 'src/app/services/cart.service';

// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.css']
// })
// export class CartComponent {
//   carts: Cart[] = [];

//   constructor(private cartService: CartService) { }

//   // ngOnInit(): void {
//   //   this.loadCarts();
//   // }

//   // loadCarts(): void {
//   //   this.cartService.getAllCarts().subscribe(carts => {
//   //     this.carts = carts;
//   //   });
//   // }
// }
