import { PaymentConfig } from '@/app/types/payment'

// Payment provider URLs
const PAYMENT_URLS = {
  LINE_PAY: {
    sandbox: 'https://sandbox-api-pay.line.me',
    production: 'https://api-pay.line.me'
  },
  ECPAY: {
    sandbox: 'https://payment-stage.ecpay.com.tw',
    production: 'https://payment.ecpay.com.tw'
  },
  JKOPAY: {
    sandbox: 'https://sandbox-api.jkopay.com',
    production: 'https://api.jkopay.com'
  }
}

// Environment check
const isProduction = process.env.NODE_ENV === 'production'

// Payment configuration
export const paymentConfig: PaymentConfig = {
  LINE_PAY: {
    channelId: process.env.LINE_PAY_CHANNEL_ID || '',
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET || '',
    isSandbox: process.env.NODE_ENV !== 'production',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://api-pay.line.me'
      : 'https://sandbox-api-pay.line.me'
  },
  ECPAY: {
    merchantId: process.env.ECPAY_MERCHANT_ID || '',
    hashKey: process.env.ECPAY_HASH_KEY || '',
    hashIv: process.env.ECPAY_HASH_IV || '',
    isSandbox: process.env.NODE_ENV !== 'production',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://payment.ecpay.com.tw'
      : 'https://payment-stage.ecpay.com.tw'
  },
  JKOPAY: {
    merchantId: process.env.JKOPAY_MERCHANT_ID || '',
    apiKey: process.env.JKOPAY_API_KEY || '',
    apiSecret: process.env.JKOPAY_API_SECRET || '',
    isSandbox: process.env.NODE_ENV !== 'production',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.jkopay.com'
      : 'https://sandbox-api.jkopay.com'
  }
}

// Payment validation
export const validatePaymentConfig = () => {
  const missingCredentials: string[] = [];

  // Validate LINE Pay credentials
  if (!process.env.LINE_PAY_CHANNEL_ID) missingCredentials.push('LINE_PAY_CHANNEL_ID');
  if (!process.env.LINE_PAY_CHANNEL_SECRET) missingCredentials.push('LINE_PAY_CHANNEL_SECRET');

  // Validate ECPay credentials
  if (!process.env.ECPAY_MERCHANT_ID) missingCredentials.push('ECPAY_MERCHANT_ID');
  if (!process.env.ECPAY_HASH_KEY) missingCredentials.push('ECPAY_HASH_KEY');
  if (!process.env.ECPAY_HASH_IV) missingCredentials.push('ECPAY_HASH_IV');

  // Validate JKO Pay credentials
  if (!process.env.JKOPAY_MERCHANT_ID) missingCredentials.push('JKOPAY_MERCHANT_ID');
  if (!process.env.JKOPAY_API_KEY) missingCredentials.push('JKOPAY_API_KEY');
  if (!process.env.JKOPAY_API_SECRET) missingCredentials.push('JKOPAY_API_SECRET');

  if (missingCredentials.length > 0) {
    console.warn('Missing payment credentials:', missingCredentials.join(', '));
    return false;
  }

  return true;
}

// Payment method display information
export const PAYMENT_METHOD_INFO = {
  LINE_PAY: {
    name: 'LINE Pay',
    icon: '/images/line-pay.png',
    description: 'Pay securely with LINE Pay'
  },
  ECPAY: {
    name: 'ECPay',
    icon: '/images/ecpay.png',
    description: 'Multiple payment options with ECPay'
  },
  JKOPAY: {
    name: 'JKO Pay',
    icon: '/images/jkopay.png',
    description: 'Quick and easy payment with JKO Pay'
  },
  CONVENIENCE_STORE: {
    name: 'Convenience Store',
    icon: '/images/convenience-store.png',
    description: 'Pay at your nearest convenience store'
  }
}

// Convenience store configuration
export const CONVENIENCE_STORE_CONFIG = {
  '7_ELEVEN': {
    code: '7_ELEVEN',
    name: '7-ELEVEN',
    paymentDuration: 24, // hours
    minAmount: 30, // NT$
    maxAmount: 20000 // NT$
  },
  'FAMILY_MART': {
    code: 'FAMILY_MART',
    name: 'Family Mart',
    paymentDuration: 48, // hours
    minAmount: 30, // NT$
    maxAmount: 20000 // NT$
  }
}