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
  }
}



// order.ts
// import { UseBadgeParameters } from "@mui/base";
// import { Customer } from "./customer";
// import { OrderItem } from "./order-item";
// export class Order {
//   id: number;
//   customer: Customer["id"];
//   transaction_id: string;
//   timestamp: Date | string;
//   payer_id: string;
//   total_amount: number | string;
//   currency: string;
//   user: number;
//   order_items: OrderItem[];

//   constructor() {
//     this.id = 0;
//     this.customer = 0;
//     this.transaction_id = '';
//     this.timestamp = new Date();
//     this.payer_id = '';
//     this.total_amount = 0;
//     this.currency = 'USD';
//     this.user = 0;
//     this.order_items = [];
//   }
// }
