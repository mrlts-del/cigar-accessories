import { BasePaymentProvider } from './BasePaymentProvider'
import { PaymentRequest, PaymentResponse, PaymentConfig } from '../types'
import { PaymentError } from '../errors/PaymentError'
import crypto from 'crypto'

interface JKOPayResponse {
  status: string
  message: string
  data?: {
    orderId: string
    transactionId: string
    paymentUrl?: string
    paymentCode?: string
    transactionStatus: string
  }
}

export class JKOPayService extends BasePaymentProvider {
  private readonly config: PaymentConfig
  private readonly baseUrl: string

  constructor() {
    super()
    this.config = {
      channelId: process.env.JKO_PAY_MERCHANT_ID || '',
      channelSecret: process.env.JKO_PAY_SECRET_KEY || '',
      returnUrl: process.env.JKO_PAY_RETURN_URL || '',
      cancelUrl: process.env.JKO_PAY_CANCEL_URL || '',
      webhookUrl: process.env.JKO_PAY_WEBHOOK_URL || '',
      sandbox: process.env.NODE_ENV !== 'production',
    }

    if (!this.config.channelId || !this.config.channelSecret) {
      throw new PaymentError('JKO Pay credentials are not configured')
    }

    this.baseUrl = this.config.sandbox
      ? 'https://sandbox-api.jkopay.com'
      : 'https://api.jkopay.com'
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Merchant-ID': this.config.channelId,
          'X-Signature': this.generateSignature(request),
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          orderId: request.orderId,
          items: request.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          returnUrl: this.config.returnUrl,
          cancelUrl: this.config.cancelUrl,
        }),
      })

      const data = await response.json() as JKOPayResponse

      if (data.status !== 'success') {
        throw new PaymentError(data.message || 'Failed to process JKO Pay payment')
      }

      return {
        success: true,
        transactionId: data.data?.transactionId || '',
        orderId: request.orderId,
        status: 'PENDING',
        paymentUrl: data.data?.paymentUrl,
        paymentCode: data.data?.paymentCode,
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to process JKO Pay payment')
    }
  }

  async confirmPayment(
    transactionId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/payments/${transactionId}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Merchant-ID': this.config.channelId,
            'X-Signature': this.generateSignature({ transactionId, amount, currency }),
          },
          body: JSON.stringify({
            amount,
            currency,
          }),
        }
      )

      const data = await response.json() as JKOPayResponse

      if (data.status !== 'success') {
        throw new PaymentError(data.message || 'Failed to confirm JKO Pay payment')
      }

      return {
        success: true,
        transactionId,
        orderId: data.data?.orderId || '',
        status: data.data?.transactionStatus || 'UNKNOWN',
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to confirm JKO Pay payment')
    }
  }

  async validateWebhook(payload: any): Promise<boolean> {
    try {
      const signature = payload.headers['x-signature']
      if (!signature) {
        return false
      }

      const body = JSON.stringify(payload.body)
      const hmac = crypto
        .createHmac('SHA256', this.config.channelSecret)
        .update(body)
        .digest('hex')

      return hmac === signature
    } catch (error) {
      return false
    }
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/payments/${transactionId}/status`,
        {
          headers: {
            'X-Merchant-ID': this.config.channelId,
            'X-Signature': this.generateSignature({ transactionId }),
          },
        }
      )

      const data = await response.json() as JKOPayResponse

      if (data.status !== 'success') {
        throw new PaymentError(data.message || 'Failed to get payment status')
      }

      return data.data?.transactionStatus || 'UNKNOWN'
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to get payment status')
    }
  }

  private generateSignature(data: any): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        acc[key] = data[key]
        return acc
      }, {} as Record<string, any>)

    const stringToSign = JSON.stringify(sortedData)
    return crypto
      .createHmac('SHA256', this.config.channelSecret)
      .update(stringToSign)
      .digest('hex')
  }
} 