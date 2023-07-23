// customer.ts
export class Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2: string | undefined;
  city: string;
  state: string;
  zipcode: string;
  user: number;

  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.addressLine1 = '';
    this.addressLine2 = '';
    this.city = '';
    this.state = '';
    this.zipcode = '';
    this.user = 0;
  }
}
