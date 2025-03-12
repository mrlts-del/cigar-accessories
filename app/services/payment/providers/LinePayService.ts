import { BasePaymentProvider } from './BasePaymentProvider'
import { PaymentRequest, PaymentResponse, PaymentConfig } from '../types'
import { PaymentError } from '../errors/PaymentError'
import crypto from 'crypto'

interface LinePayResponse {
  info: {
    transactionId: string
    paymentUrl?: {
      web: string
    }
    orderId: string
    transactionStatus: string
  }
  message?: string
}

export class LinePayService extends BasePaymentProvider {
  private readonly config: PaymentConfig
  private readonly baseUrl: string = process.env.LINE_PAY_BASE_URL || 'https://api-pay.line.me'
  constructor(channelId: string, channelSecret: string, returnUrl: string) {
    super()
    this.config = {
      channelId: channelId || '',
      channelSecret: channelSecret || '',
      returnUrl: returnUrl || '',
      cancelUrl: process.env.LINE_PAY_CANCEL_URL || '',
      webhookUrl: process.env.LINE_PAY_WEBHOOK_URL || '',
      sandbox: process.env.NODE_ENV !== 'production',
    }

    if (!this.config.channelId || !this.config.channelSecret) {
      throw new PaymentError('LINE Pay credentials are not configured')
    }

    this.baseUrl = this.config.sandbox
      ? 'https://sandbox-api-pay.line.me'
      : 'https://api-pay.line.me'
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/payments/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LINE-ChannelId': this.config.channelId,
          'X-LINE-ChannelSecret': this.config.channelSecret,
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          orderId: request.orderId,
          packages: [
            {
              id: request.orderId,
              amount: request.amount,
              products: request.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          ],
          redirectUrls: {
            confirmUrl: this.config.returnUrl,
            cancelUrl: this.config.cancelUrl,
          },
        }),
      })

      const data = await response.json() as LinePayResponse

      if (!response.ok) {
        throw new PaymentError(data.message || 'Failed to process LINE Pay payment')
      }

      return {
        success: true,
        transactionId: data.info.transactionId,
        orderId: request.orderId,
        status: 'PENDING',
        paymentUrl: data.info.paymentUrl?.web,
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to process LINE Pay payment')
    }
  }

  async confirmPayment(
    transactionId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/payments/${transactionId}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-LINE-ChannelId': this.config.channelId,
            'X-LINE-ChannelSecret': this.config.channelSecret,
          },
          body: JSON.stringify({
            amount,
            currency,
          }),
        }
      )

      const data = await response.json() as LinePayResponse

      if (!response.ok) {
        throw new PaymentError(data.message || 'Failed to confirm LINE Pay payment')
      }

      return {
        success: true,
        transactionId,
        orderId: data.info.orderId,
        status: data.info.transactionStatus,
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to confirm LINE Pay payment')
    }
  }

  async validateWebhook(payload: any): Promise<boolean> {
    try {
      const signature = payload.headers['x-line-signature']
      if (!signature) {
        return false
      }

      const body = JSON.stringify(payload.body)
      const hmac = crypto
        .createHmac('SHA256', this.config.channelSecret)
        .update(body)
        .digest('base64')

      return hmac === signature
    } catch (error) {
      return false
    }
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/payments/${transactionId}/status`,
        {
          headers: {
            'X-LINE-ChannelId': this.config.channelId,
            'X-LINE-ChannelSecret': this.config.channelSecret,
          },
        }
      )

      const data = await response.json() as LinePayResponse

      if (!response.ok) {
        throw new PaymentError(data.message || 'Failed to get payment status')
      }

      return data.info.transactionStatus
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to get payment status')
    }
  }
} 