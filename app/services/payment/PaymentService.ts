import { PaymentProvider } from '@/app/config/payment'
import { PaymentConfig } from '@/app/types/payment'
import {
  LinePayService,
  JKOPayService,
  ECPayService,
  ConvenienceStoreService,
  BasePaymentProvider,
} from './providers'
import { PaymentError } from './errors/PaymentError'
import { TransactionLogger } from './utils/TransactionLogger'

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

export class PaymentService {
  private readonly logger: TransactionLogger
  private readonly providers: Map<PaymentProvider, BasePaymentProvider>

  constructor() {
    this.logger = new TransactionLogger()
    this.providers = new Map<PaymentProvider, BasePaymentProvider>([
      ['LINE_PAY' as PaymentProvider, new LinePayService()],
      ['JKO_PAY' as PaymentProvider, new JKOPayService()],
      ['ECPAY' as PaymentProvider, new ECPayService()],
      ['CONVENIENCE_STORE' as PaymentProvider, new ConvenienceStoreService()],
    ])
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment request
      this.validatePaymentRequest(request)

      // Get the appropriate payment provider
      const provider = this.providers.get(request.paymentMethod)
      if (!provider) {
        throw new PaymentError('Unsupported payment method')
      }

      // Log the payment attempt
      await this.logger.logPaymentAttempt(request)

      // Process the payment
      const response = await provider.processPayment(request)

      // Log the payment result
      await this.logger.logPaymentResult(request, response)

      return response
    } catch (error: unknown) {
      // Log the error
      await this.logger.logPaymentError(request, error instanceof Error ? error : new Error(String(error)))

      // Handle specific payment errors
      if (error instanceof PaymentError) {
        return {
          success: false,
          transactionId: '',
          orderId: request.orderId,
          status: 'FAILED',
          error: error.message,
        }
      }

      // Handle unexpected errors
      console.error('Payment processing error:', error)
      return {
        success: false,
        transactionId: '',
        orderId: request.orderId,
        status: 'ERROR',
        error: 'An unexpected error occurred during payment processing',
      }
    }
  }

  async confirmPayment(
    provider: PaymentProvider,
    transactionId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResponse> {
    try {
      const paymentProvider = this.providers.get(provider)
      if (!paymentProvider) {
        throw new PaymentError('Unsupported payment method')
      }

      const response = await paymentProvider.confirmPayment(
        transactionId,
        amount,
        currency
      )

      await this.logger.logPaymentConfirmation(provider, transactionId, response)

      return response
    } catch (error: unknown) {
      await this.logger.logPaymentError(
        { provider, transactionId, amount, currency },
        error instanceof Error ? error : new Error(String(error))
      )

      if (error instanceof PaymentError) {
        return {
          success: false,
          transactionId,
          orderId: '',
          status: 'FAILED',
          error: error.message,
        }
      }

      console.error('Payment confirmation error:', error)
      return {
        success: false,
        transactionId,
        orderId: '',
        status: 'ERROR',
        error: 'An unexpected error occurred during payment confirmation',
      }
    }
  }

  private validatePaymentRequest(request: PaymentRequest): void {
    // Validate required fields
    if (!request.amount || request.amount <= 0) {
      throw new PaymentError('Invalid payment amount')
    }

    if (!request.currency) {
      throw new PaymentError('Currency is required')
    }

    if (!request.orderId) {
      throw new PaymentError('Order ID is required')
    }

    if (!request.customerId) {
      throw new PaymentError('Customer ID is required')
    }

    if (!request.paymentMethod) {
      throw new PaymentError('Payment method is required')
    }

    if (!request.items || request.items.length === 0) {
      throw new PaymentError('At least one item is required')
    }

    // Validate total amount matches items
    const totalAmount = request.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    if (Math.abs(totalAmount - request.amount) > 0.01) {
      throw new PaymentError('Total amount does not match items')
    }
  }
} 