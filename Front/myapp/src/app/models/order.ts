import { OrderItem } from "./order-item";

// order.ts
export class Order {
  id?: number;
  user: number | null;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
  transaction_id: string;
  timestamp: Date;
  payer_id: string;
  total_amount: number;
  currency: string;
  order_items: OrderItem[];

  constructor() {
    this.id = undefined;
    this.user = null;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.state = '';
    this.zipcode = '';
    this.transaction_id = '';
    this.timestamp = new Date();
    this.payer_id = '';
    this.total_amount = 0;
    this.currency = 'USD';
    this.order_items = [];
  }
}

