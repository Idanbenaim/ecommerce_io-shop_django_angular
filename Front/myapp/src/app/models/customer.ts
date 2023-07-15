export class Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  user: number; // Assuming user is referenced by its ID

  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.address = '';
    this.city = '';
    this.state = '';
    this.zipcode = '';
    this.user = 0;
  }
}
