// order-confirmation.ts
export class OrderConfirmation {
  constructor(
    public customerName: string,
    public customerAddress: string,
    public customerPhoneNumber: string,
    public orderDetails: any[], // Use your Order model here instead of any[]
    public totalAmount: number
  ) { }
}
