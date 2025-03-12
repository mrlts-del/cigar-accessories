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

// Payment provider types
export type PaymentProvider = 'LINE_PAY' | 'JKO_PAY' | 'ECPAY' | 'CONVENIENCE_STORE'

// Environment configuration
const config = {
  // API URLs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // LINE Pay configuration
  linePay: {
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
    returnUrl: process.env.LINE_PAY_RETURN_URL || 'http://localhost:3000/checkout/success',
    cancelUrl: process.env.LINE_PAY_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.line.me/v2/payments'
      : 'https://sandbox-api.line.me/v2/payments',
  },

  // ECPay configuration
  ecPay: {
    merchantId: process.env.ECPAY_MERCHANT_ID,
    hashKey: process.env.ECPAY_HASH_KEY,
    hashIv: process.env.ECPAY_HASH_IV,
    returnUrl: process.env.ECPAY_RETURN_URL || 'http://localhost:3000/checkout/success',
    cancelUrl: process.env.ECPAY_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
      : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
  },

  // JKO Pay configuration
  jkoPay: {
    apiKey: process.env.JKO_PAY_API_KEY,
    returnUrl: process.env.JKO_PAY_RETURN_URL || 'http://localhost:3000/checkout/success',
    cancelUrl: process.env.JKO_PAY_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.jkopay.com/v1/payments'
      : 'https://sandbox-api.jkopay.com/v1/payments',
  },

  // Convenience Store configuration
  convenienceStore: {
    apiKey: process.env.CONVENIENCE_STORE_API_KEY,
    returnUrl: process.env.CONVENIENCE_STORE_RETURN_URL || 'http://localhost:3000/checkout/success',
    cancelUrl: process.env.CONVENIENCE_STORE_CANCEL_URL || 'http://localhost:3000/checkout/cancel',
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.convenience-store.com/v1/payments'
      : 'https://sandbox-api.convenience-store.com/v1/payments',
  },

  // Webhook configuration
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
    url: process.env.WEBHOOK_URL || 'https://your-domain.com/api/payments/webhook',
  },

  // Payment configuration
  payment: {
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'TWD',
    minimumAmount: Number(process.env.MINIMUM_PAYMENT_AMOUNT) || 1,
    maximumAmount: Number(process.env.MAXIMUM_PAYMENT_AMOUNT) || 100000,
    timeoutMinutes: Number(process.env.PAYMENT_TIMEOUT_MINUTES) || 30,
  },

  // Security configuration
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    jwtSecret: process.env.JWT_SECRET,
  },
}

// Validate required environment variables
function validateConfig() {
  const requiredVars = [
    'LINE_PAY_CHANNEL_ID',
    'LINE_PAY_CHANNEL_SECRET',
    'ECPAY_MERCHANT_ID',
    'ECPAY_HASH_KEY',
    'ECPAY_HASH_IV',
    'JKO_PAY_API_KEY',
    'CONVENIENCE_STORE_API_KEY',
    'WEBHOOK_SECRET',
    'ENCRYPTION_KEY',
    'JWT_SECRET',
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }
}

// Validate configuration on import
validateConfig()

export default config