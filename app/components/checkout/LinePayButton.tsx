'use client'

import { useState } from 'react'
import { useCartStore } from '@/app/store/cartStore'
import Image from 'next/image'

interface LinePayButtonProps {
  onLoading: (isLoading: boolean) => void;
}

export default function LinePayButton({ onLoading }: LinePayButtonProps): React.ReactElement {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { items } = useCartStore()

  const generateOrderId = () => {
    return `LP${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  };

  const handleLinePayment = async () => {
    onLoading(true);
    setIsRedirecting(true);
    
    try {
      const orderId = generateOrderId();
      const amount = items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const response = await fetch('/api/payments/line-pay', {
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

      if (data.info?.paymentUrl?.web) {
        window.location.href = data.info.paymentUrl.web;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      console.error('LINE Pay payment error:', error);
      alert('Payment initialization failed. Please try again.');
      setIsRedirecting(false);
    } finally {
      onLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLinePayment}
      disabled={isRedirecting}
      className="line-pay-button"
      type="button"
    >
      <Image 
        src="/images/line-pay-logo.png" 
        alt="LINE Pay" 
        width={24} 
        height={24} 
        className="payment-icon"
      />
      {isRedirecting ? 'Redirecting...' : 'Pay with LINE Pay'}
    </button>
  );
}