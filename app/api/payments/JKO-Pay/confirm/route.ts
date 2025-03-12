import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Types
interface JKOPayConfirmRequest {
  amount: number
  currency: string
  orderId: string
  transactionId: string
  paymentMethod: string
}

// JKO Pay API configuration
const JKO_PAY_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.jkopay.com/v1/payments'
  : 'https://sandbox-api.jkopay.com/v1/payments'

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const body: JKOPayConfirmRequest = await request.json()

    // Validate required fields
    if (!body.amount || !body.currency || !body.orderId || !body.transactionId || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare JKO Pay confirmation request
    const confirmRequest = {
      amount: body.amount,
      currency: body.currency,
      paymentMethod: body.paymentMethod,
    }

    // Call JKO Pay API to confirm payment
    const response = await fetch(
      `${JKO_PAY_API_URL}/${body.transactionId}/confirm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.JKO_PAY_API_KEY}`,
        },
        body: JSON.stringify(confirmRequest),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment confirmation failed', details: data },
        { status: response.status }
      )
    }

    // Return successful confirmation
    return NextResponse.json({
      success: true,
      data: {
        transactionId: body.transactionId,
        orderId: body.orderId,
        status: 'CONFIRMED',
        ...data,
      },
    })

  } catch (error) {
    console.error('JKO Pay confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 