import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Types
interface LinePayConfirmRequest {
  amount: number
  currency: string
  orderId: string
  transactionId: string
}

// LINE Pay API configuration
const LINE_PAY_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.line.me/v2/payments'
  : 'https://sandbox-api.line.me/v2/payments'

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const body: LinePayConfirmRequest = await request.json()

    // Validate required fields
    if (!body.amount || !body.currency || !body.orderId || !body.transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare LINE Pay confirmation request
    const confirmRequest = {
      amount: body.amount,
      currency: body.currency,
    }

    // Call LINE Pay API to confirm payment
    const response = await fetch(
      `${LINE_PAY_API_URL}/${body.transactionId}/confirm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LINE-ChannelId': process.env.LINE_PAY_CHANNEL_ID!,
          'X-LINE-ChannelSecret': process.env.LINE_PAY_CHANNEL_SECRET!,
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
    console.error('LINE Pay confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
