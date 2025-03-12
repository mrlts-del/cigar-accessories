import { PaymentRequest, PaymentResponse } from './types'; // Ensure the path is correct

export abstract class BasePaymentProvider {
  protected transactionId: string;
  protected amount: number;
  private currency: string;

  constructor(transactionId: string, amount: number, currency: string) {
    this.transactionId = transactionId;
    this.amount = amount;
    this.currency = currency;
  }

  abstract processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract confirmPayment(
    transactionId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResponse>;
  abstract validateWebhook(payload: any): Promise<boolean>;
  abstract getPaymentStatus(transactionId: string): Promise<string>;
} 