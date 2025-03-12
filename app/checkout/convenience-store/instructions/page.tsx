'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ConvenienceStoreInstructions() {
  const searchParams = useSearchParams()
  const paymentCode = searchParams.get('code')
  const store = searchParams.get('store')
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60) // 48 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStoreInstructions = () => {
    switch (store) {
      case '7_ELEVEN':
        return [
          'Go to any 7-ELEVEN store in Taiwan',
          'At the ibon kiosk, select "Payment Services"',
          `Enter the payment code: ${paymentCode}`,
          'Proceed to the counter with the payment slip',
          'Make the payment within the time limit'
        ];
      case 'FAMILY_MART':
        return [
          'Go to any Family Mart store in Taiwan',
          'At the FamiPort kiosk, select "Payment Services"',
          `Enter the payment code: ${paymentCode}`,
          'Proceed to the counter with the payment slip',
          'Make the payment within the time limit'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="convenience-store-instructions">
      <div className="instructions-container">
        <h1>Payment Instructions</h1>
        
        <div className="store-info">
          <Image 
            src={`/images/${store?.toLowerCase()}-logo.png`}
            alt={store?.replace('_', ' ') || ''}
            width={80}
            height={80}
            className="store-logo"
          />
          <div className="payment-details">
            <div className="payment-code">
              <h2>Payment Code</h2>
              <div className="code">{paymentCode}</div>
            </div>
            <div className="time-remaining">
              <h3>Time Remaining</h3>
              <div className="timer">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </div>

        <div className="instructions">
          <h2>How to Pay</h2>
          <ol>
            {getStoreInstructions().map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        <div className="actions">
          <Link href="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}