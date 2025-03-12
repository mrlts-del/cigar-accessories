import { NextResponse } from 'next/server'
import { LinePayService } from '../../../services/linePay'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, orderId, amount } = body

    // Add await here
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`

    const linePayService = new LinePayService()
    
    const response = await linePayService.createPayment(
      amount,
      orderId,
      items,
      baseUrl
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error('LINE Pay request error:', error)
    return NextResponse.json(
      { error: 'Payment request failed' },
      { status: 500 }
    )
  }
}