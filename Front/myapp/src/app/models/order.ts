// order.ts
import { UseBadgeParameters } from "@mui/base";
import { Customer } from "./customer";
import { OrderItem } from "./order-item";
export class Order {
  id: number;
  customer: Customer;
  transaction_id: string;
  timestamp: Date | string;
  payer_id: string;
  total_amount: number | string;
  currency: string;
  user: Customer["user"];
  order_items: OrderItem[];

  constructor() {
    this.id = 0;
    this.customer = new Customer();
    this.transaction_id = '';
    this.timestamp = new Date();
    this.payer_id = '';
    this.total_amount = 0;
    this.currency = '';
    this.user = new Customer().user;
    this.order_items = [];
  }
}
