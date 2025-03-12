import { BasePaymentProvider } from './BasePaymentProvider'
import { PaymentRequest, PaymentResponse, PaymentConfig } from '../types'
import { PaymentError } from '../errors/PaymentError'
import crypto from 'crypto'

interface ECPayResponse {
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

export class ECPayService extends BasePaymentProvider {
  private readonly config: PaymentConfig
  private readonly baseUrl: string

  constructor() {
    super()
    this.config = {
      channelId: process.env.ECPAY_MERCHANT_ID || '',
      channelSecret: process.env.ECPAY_HASH_KEY || '',
      returnUrl: process.env.ECPAY_RETURN_URL || '',
      cancelUrl: process.env.ECPAY_CANCEL_URL || '',
      webhookUrl: process.env.ECPAY_WEBHOOK_URL || '',
      sandbox: process.env.NODE_ENV !== 'production',
    }

    if (!this.config.channelId || !this.config.channelSecret) {
      throw new PaymentError('ECPay credentials are not configured')
    }

    this.baseUrl = this.config.sandbox
      ? 'https://payment-stage.ecpay.com.tw'
      : 'https://payment.ecpay.com.tw'
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const formData = new URLSearchParams()
      formData.append('MerchantID', this.config.channelId)
      formData.append('MerchantTradeNo', request.orderId)
      formData.append('MerchantTradeDate', new Date().toISOString().replace(/[-:]/g, '').split('.')[0])
      formData.append('PaymentType', 'aio')
      formData.append('TotalAmount', request.amount.toString())
      formData.append('TradeDesc', crypto.createHash('md5').update(request.orderId).digest('hex'))
      formData.append('ItemName', request.items.map(item => `${item.name} x${item.quantity}`).join('#'))

      // Add payment methods
      formData.append('ChoosePayment', 'ALL')
      formData.append('EncryptType', '1')

      // Add return URLs
      formData.append('ReturnURL', this.config.returnUrl)
      formData.append('ClientBackURL', this.config.cancelUrl)
      formData.append('OrderResultURL', this.config.webhookUrl)

      // Generate CheckMacValue
      const checkMacValue = this.generateCheckMacValue(formData)
      formData.append('CheckMacValue', checkMacValue)

      const response = await fetch(`${this.baseUrl}/Cashier/AioCheckOut/V5`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        throw new PaymentError('Failed to process ECPay payment')
      }

      // ECPay returns an HTML form that needs to be submitted to their payment page
      const html = await response.text()
      const paymentUrl = this.extractPaymentUrl(html)

      return {
        success: true,
        transactionId: request.orderId, // ECPay uses orderId as transactionId
        orderId: request.orderId,
        status: 'PENDING',
        paymentUrl,
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to process ECPay payment')
    }
  }

  async confirmPayment(
    transactionId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResponse> {
    try {
      const formData = new URLSearchParams()
      formData.append('MerchantID', this.config.channelId)
      formData.append('MerchantTradeNo', transactionId)
      formData.append('CheckMacValue', this.generateCheckMacValue(formData))

      const response = await fetch(`${this.baseUrl}/Cashier/QueryTradeInfo/V5`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      const data = await response.json() as ECPayResponse

      if (data.status !== 'success') {
        throw new PaymentError(data.message || 'Failed to confirm ECPay payment')
      }

      return {
        success: true,
        transactionId,
        orderId: data.data?.orderId || transactionId,
        status: data.data?.transactionStatus || 'UNKNOWN',
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error
      }
      throw new PaymentError('Failed to confirm ECPay payment')
    }
  }

  async validateWebhook(payload: any): Promise<boolean> {
    try {
      const checkMacValue = payload.CheckMacValue
      if (!checkMacValue) {
        return false
      }

      const calculatedCheckMacValue = this.generateCheckMacValue(payload)
      return checkMacValue === calculatedCheckMacValue
    } catch (error) {
      return false
    }
  }

  async getPaymentStatus(transactionId: string): Promise<string> {
    try {
      const formData = new URLSearchParams()
      formData.append('MerchantID', this.config.channelId)
      formData.append('MerchantTradeNo', transactionId)
      formData.append('CheckMacValue', this.generateCheckMacValue(formData))

      const response = await fetch(`${this.baseUrl}/Cashier/QueryTradeInfo/V5`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      const data = await response.json() as ECPayResponse

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

  private generateCheckMacValue(data: URLSearchParams | Record<string, string>): string {
    const sortedData = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const stringToHash = `HashKey=${this.config.channelSecret}&${sortedData}&HashIV=${this.config.channelSecret}`
    return crypto.createHash('sha256').update(stringToHash).digest('hex').toUpperCase()
  }

  private extractPaymentUrl(html: string): string {
    const match = html.match(/action="([^"]+)"/)
    return match ? match[1] : ''
  }
} 