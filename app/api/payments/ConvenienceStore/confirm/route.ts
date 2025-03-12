import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Types
interface ConvenienceStoreConfirmRequest {
  amount: number
  currency: string
  orderId: string
  storeType: '7_ELEVEN' | 'FAMILY_MART'
  customerName: string
  customerPhone: string
}

// Convenience Store API configuration
const CONVENIENCE_STORE_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.convenience-store.com/v1/payments'
  : 'https://sandbox-api.convenience-store.com/v1/payments'

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const body: ConvenienceStoreConfirmRequest = await request.json()

    // Validate required fields
    if (!body.amount || !body.currency || !body.orderId || !body.storeType || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate store type
    if (!['7_ELEVEN', 'FAMILY_MART'].includes(body.storeType)) {
      return NextResponse.json(
        { error: 'Invalid store type' },
        { status: 400 }
      )
    }

    // Prepare Convenience Store payment request
    const paymentRequest = {
      amount: body.amount,
      currency: body.currency,
      storeType: body.storeType,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
    }

    // Call Convenience Store API to create payment
    const response = await fetch(
      `${CONVENIENCE_STORE_API_URL}/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CONVENIENCE_STORE_API_KEY}`,
        },
        body: JSON.stringify(paymentRequest),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment creation failed', details: data },
        { status: response.status }
      )
    }

    // Return successful payment creation
    return NextResponse.json({
      success: true,
      data: {
        orderId: body.orderId,
        paymentCode: data.paymentCode,
        storeType: body.storeType,
        status: 'PENDING',
        ...data,
      },
    })

  } catch (error) {
    console.error('Convenience Store payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 