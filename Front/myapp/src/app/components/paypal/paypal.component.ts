// paypal.component.ts
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
declare var paypal: any;
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
  @ViewChild('paypal', { static: true }) private paypalElement!: ElementRef;


  @Output() onApprove = new EventEmitter();
  @Output() onError = new EventEmitter();

  constructor(private cartService: CartService) { }

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
        this.onApprove.emit(order);
      },
      onError: (err: any) => {
        this.onError.emit(err);
      }
    }).render(this.paypalElement.nativeElement);
  }
}
