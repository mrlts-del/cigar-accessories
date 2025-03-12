'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/app/store/cartStore'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    // Clear the cart when payment is successful
    clearCart()
  }, [clearCart])

  return (
    <div className="checkout-success">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="success-actions">
          <Link href="/" className="continue-shopping">
            Continue Shopping
          </Link>
          <Link href="/orders" className="view-order">
            View Order
          </Link>
        </div>
      </div>
    </div>
  )
}