// cart-item.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { CartItemService } from '../../services/cart-item.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() CartItem!: CartItem;

  constructor(private cartItemService: CartItemService) { }

  ngOnInit(): void {
  }

  updateCartItem(quantity: number) {
    this.CartItem.qty = quantity;
    this.cartItemService.updateCartItem(this.CartItem.id, this.CartItem).subscribe();
  }
}
