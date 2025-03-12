import { paymentConfig } from '../config/payment'
import crypto from 'crypto'

interface LinePayRequestBody {
  amount: number;
  currency: string;
  orderId: string;
  packages: {
    id: string;
    amount: number;
    name: string;
    products: {
      name: string;
      quantity: number;
      price: number;
    }[];
  }[];
  redirectUrls: {
    confirmUrl: string;
    cancelUrl: string;
  };
}

export class LinePayService {
  private config = paymentConfig.LINE_PAY;
  
  private generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private generateSignature(body: string, nonce: string): string {
    const signatureString = `${this.config.channelSecret}${body}${nonce}`;
    return crypto
      .createHmac('sha256', this.config.channelSecret)
      .update(signatureString)
      .digest('base64');
  }

  async createPayment(
    amount: number,
    orderId: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    baseUrl: string
  ) {
    const nonce = this.generateNonce();
    
    const requestBody: LinePayRequestBody = {
      amount,
      currency: 'TWD',
      orderId,
      packages: [
        {
          id: orderId,
          amount: amount,
          name: 'DEFY ORDINARY Order',
          products: items
        }
      ],
      redirectUrls: {
        confirmUrl: `${baseUrl}/api/payments/line-pay/confirm`,
        cancelUrl: `${baseUrl}/cart?error=cancelled`
      }
    };

    const requestBodyString = JSON.stringify(requestBody);
    const signature = this.generateSignature(requestBodyString, nonce);

    try {
      const response = await fetch(`${this.config.apiUrl}/v3/payments/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LINE-ChannelId': this.config.channelId,
          'X-LINE-Authorization-Nonce': nonce,
          'X-LINE-Authorization': signature
        },
        body: requestBodyString
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'LINE Pay request failed');
      }

      return data;
    } catch (error) {
      console.error('LINE Pay error:', error);
      throw error;
    }
  }

  async confirmPayment(transactionId: string, amount: number, currency: string = 'TWD') {
    const nonce = this.generateNonce();
    
    const requestBody = {
      amount,
      currency
    };

    const requestBodyString = JSON.stringify(requestBody);
    const signature = this.generateSignature(requestBodyString, nonce);

    try {
      const response = await fetch(
        `${this.config.apiUrl}/v3/payments/${transactionId}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-LINE-ChannelId': this.config.channelId,
            'X-LINE-Authorization-Nonce': nonce,
            'X-LINE-Authorization': signature
          },
          body: requestBodyString
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'LINE Pay confirmation failed');
      }

      return data;
    } catch (error) {
      console.error('LINE Pay confirmation error:', error);
      throw error;
    }
  }
}