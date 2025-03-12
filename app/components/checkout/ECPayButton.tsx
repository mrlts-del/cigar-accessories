'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/app/store/cartStore'

interface ECPayButtonProps {
  onLoading: (isLoading: boolean) => void;
}

export default function ECPayButton({ onLoading }: ECPayButtonProps): React.ReactElement {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items } = useCartStore()

  const generateOrderId = () => {
    return `EC${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  };

  const handleECPayment = async () => {
    setIsProcessing(true);
    onLoading(true);

    try {
      const orderId = generateOrderId();
      const amount = items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const response = await fetch('/api/payments/ecpay', {
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

      if (data.success && data.form) {
        // Create a hidden form to submit ECPay data
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.form.action;

        Object.entries(data.form.fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('ECPay payment error:', error);
      alert('Payment initialization failed. Please try again.');
      setIsProcessing(false);
      onLoading(false);
    }
  };

  return (
    <div className="ecpay-container">
      <button 
        onClick={handleECPayment}
        disabled={isProcessing}
        className="ecpay-button"
        type="button"
      >
        <Image 
          src="/images/ecpay-logo.png" 
          alt="ECPay" 
          width={24} 
          height={24} 
          className="payment-icon"
        />
        {isProcessing ? 'Processing...' : 'Pay with ECPay'}
      </button>
    </div>
  );
}