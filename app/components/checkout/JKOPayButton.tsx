'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/app/store/cartStore'

interface JKOPayButtonProps {
  onLoading: (isLoading: boolean) => void;
}

export default function JKOPayButton({ onLoading }: JKOPayButtonProps): React.ReactElement {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items } = useCartStore()

  const generateOrderId = () => {
    return `JKO${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  };

  const handleJKOPayment = async () => {
    setIsProcessing(true);
    onLoading(true);

    try {
      const orderId = generateOrderId();
      const amount = items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const response = await fetch('/api/payments/jkopay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          amount: Math.round(amount),
          items: items.map(item => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('JKO Pay payment error:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  };

  return (
    <button 
      onClick={handleJKOPayment}
      disabled={isProcessing}
      className="jkopay-button"
      type="button"
    >
      <Image 
        src="/images/jkopay-logo.png" 
        alt="JKO Pay" 
        width={24} 
        height={24} 
        className="payment-icon"
      />
      {isProcessing ? 'Processing...' : 'Pay with JKO Pay'}
    </button>
  );
}