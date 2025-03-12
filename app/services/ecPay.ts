import { paymentConfig } from '../config/payment'
import crypto from 'crypto'

interface ECPayRequestBody {
  MerchantID: string;
  MerchantTradeNo: string;
  MerchantTradeDate: string;
  PaymentType: string;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: string;
  CheckMacValue: string;
  OrderResultURL: string;
  ClientBackURL: string;
}

export class ECPayService {
  private config = paymentConfig.ECPAY;

  private generateCheckMacValue(params: Record<string, string | number>): string {
    // Sort parameters alphabetically
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((obj: Record<string, string | number>, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    // Create check string
    let checkString = `HashKey=${this.config.hashKey}`;
    Object.entries(sortedParams).forEach(([key, value]) => {
      checkString += `&${key}=${value}`;
    });
    checkString += `&HashIV=${this.config.hashIv}`;

    // URL encode
    checkString = encodeURIComponent(checkString).toLowerCase();

    // Replace specific characters as per ECPay specification
    checkString = checkString
      .replace(/%20/g, '+')
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')');

    // Generate SHA256 hash
    return crypto
      .createHash('sha256')
      .update(checkString)
      .digest('hex')
      .toUpperCase();
  }

  async createPayment(
    amount: number,
    orderId: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    baseUrl: string
  ) {
    const merchantTradeDate = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '/');
    const itemName = items
      .map(item => `${item.name} x ${item.quantity}`)
      .join('#');

    const requestBody: ECPayRequestBody = {
      MerchantID: this.config.merchantId,
      MerchantTradeNo: orderId,
      MerchantTradeDate: merchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: amount,
      TradeDesc: 'DEFY ORDINARY Order',
      ItemName: itemName,
      ReturnURL: `${baseUrl}/api/payments/ecpay/notify`,
      OrderResultURL: `${baseUrl}/api/payments/ecpay/result`,
      ClientBackURL: `${baseUrl}/cart`,
      ChoosePayment: 'ALL',
      CheckMacValue: '' // Will be set after generating
    };

    // Generate CheckMacValue
    const checkMacValue = this.generateCheckMacValue(
      Object.fromEntries(
        Object.entries(requestBody).filter(([key]) => key !== 'CheckMacValue')
      )
    );

    // Set the generated CheckMacValue
    requestBody.CheckMacValue = checkMacValue;

    return {
      paymentUrl: this.config.isSandbox 
        ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5' 
        : 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
      formData: requestBody,
    };
  }

  verifyCheckMacValue(params: Record<string, string | number>): boolean {
    const receivedCheckMacValue = params.CheckMacValue as string;
    const paramsWithoutCheckMacValue = { ...params };
    delete paramsWithoutCheckMacValue.CheckMacValue;
    
    const calculatedCheckMacValue = this.generateCheckMacValue(paramsWithoutCheckMacValue);
    return calculatedCheckMacValue === receivedCheckMacValue;
  }
}