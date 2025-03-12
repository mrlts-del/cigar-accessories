'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/app/store/cartStore'
import { ConvenienceStore } from '@/app/types/payment'

interface ConvenienceStoreButtonProps {
  storeType: ConvenienceStore;
  storeName: string;
  logoSrc: string;
  onLoading: (isLoading: boolean) => void;
}

export default function ConvenienceStoreButton({ 
  storeType, 
  storeName, 
  logoSrc,
  onLoading 
}: ConvenienceStoreButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items } = useCartStore()

  const generateOrderId = () => {
    return `CS${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    onLoading(true);

    try {
      const orderId = generateOrderId();
      const amount = items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const response = await fetch('/api/payments/convenience-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          amount: Math.round(amount),
          storeType,
          items: items.map(item => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment instruction page
        window.location.href = `/checkout/convenience-store/instructions?code=${data.paymentCode}&store=${storeType}`;
      } else {
        throw new Error(data.error || 'Payment generation failed');
      }
    } catch (error) {
      console.error('Convenience store payment error:', error);
      alert('Failed to generate payment code. Please try again.');
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={isProcessing}
      className="convenience-store-button"
    >
      <Image 
        src={logoSrc} 
        alt={storeName} 
        width={40} 
        height={40} 
        className="store-logo"
      />
      <div className="store-info">
        <span className="store-name">{storeName}</span>
        <span className="store-status">
          {isProcessing ? 'Processing...' : 'Generate payment code'}
        </span>
      </div>
    </button>
  );
}