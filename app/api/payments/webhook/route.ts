import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { prisma } from '@/app/lib/prisma'
import { PaymentStatus } from '@prisma/client'

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const calculatedSignature = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  )
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const signature = headersList.get('x-webhook-signature')
    const payload = await request.text()

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET || '')) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const data = JSON.parse(payload)
    const { provider, event, payment } = data

    // Process different webhook events
    switch (event) {
      case 'payment.succeeded':
        await updateOrderStatus(payment.orderId, 'PAID')
        await updatePaymentStatus(payment.transactionId, PaymentStatus.SUCCEEDED)
        break

      case 'payment.failed':
        await updateOrderStatus(payment.orderId, 'FAILED')
        await updatePaymentStatus(payment.transactionId, PaymentStatus.FAILED)
        break

      case 'payment.refunded':
        await updateOrderStatus(payment.orderId, 'REFUNDED')
        await updatePaymentStatus(payment.transactionId, PaymentStatus.REFUNDED)
        break

      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update order status
async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any }
    })
    console.log(`Updated order ${orderId} status to ${status}`)
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error)
    throw error
  }
}

// Helper function to update payment status
async function updatePaymentStatus(transactionId: string, status: PaymentStatus) {
  try {
    await prisma.payment.update({
      where: { transactionId },
      data: { status }
    })
    console.log(`Updated payment ${transactionId} status to ${status}`)
  } catch (error) {
    console.error(`Failed to update payment ${transactionId} status:`, error)
    throw error
  }
}

console.log(PaymentStatus);

type ConvenienceStore = '7_ELEVEN' | 'FAMILY_MART';

interface ConvenienceStoreButtonProps {
  storeType: ConvenienceStore;
  // other props...
}