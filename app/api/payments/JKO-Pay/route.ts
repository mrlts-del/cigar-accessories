import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentConfig } from '@/app/config/payment';
import { updateOrderStatus } from '@/app/services/orderService';
import { PaymentStatus } from '@/app/types/payment';

interface JKOPayNotification {
  merchantId: string;
  orderId: string;
  amount: string;
  status: string;
  timestamp: string;
  signature: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const body: JKOPayNotification = JSON.parse(rawBody);
    const config = paymentConfig.JKOPAY;

    // ... rest of the code remains the same ...
  } catch (error) {
    console.error('JKO Pay notification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process notification'
      },
      { status: 500 }
    );
  }
}