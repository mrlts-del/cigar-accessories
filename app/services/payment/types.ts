import { PaymentProvider } from '@/app/config/payment'

export interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerId: string
  paymentMethod: PaymentProvider
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  orderId: string
  status: string
  paymentUrl?: string
  paymentCode?: string
  error?: string
}

export interface PaymentConfig {
  channelId: string
  channelSecret: string
  returnUrl: string
  cancelUrl: string
  webhookUrl: string
  sandbox?: boolean
} 