// order.ts
import { Customer } from "./customer";

export class Order {
  id: number;
  customer: Customer;
  transaction_id: string;
  timestamp: Date;
  payer_id: string;
  total_amount: number;
  currency: string;

  constructor() {
    this.id = 0;
    this.customer = new Customer();
    this.transaction_id = '';
    this.timestamp = new Date();
    this.payer_id = '';
    this.total_amount = 0;
    this.currency = '';
  }
}
