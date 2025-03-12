'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/app/store/cartStore'
import ECPayButton from '../components/checkout/ECPayButton'
import LinePayButton from '../components/checkout/LinePayButton'
import ConvenienceStoreButton from '../components/checkout/ConvenienceStoreButton'

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { items } = useCartStore()
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="empty-checkout">
        <h1>Your cart is empty</h1>
        <p>Add some items to your cart to proceed with checkout.</p>
        <Link href="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        {/* Order Summary Section */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {items.map(item => (
              <div key={item.id} className="order-item">
                <Image 
                  src={item.image}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-note">
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="payment-methods">
          <h2>Select Payment Method</h2>
          <div className="payment-options">
            <div className="payment-section">
              <h3>Digital Payment</h3>
              <div className="payment-buttons">
                <LinePayButton onLoading={setIsLoading} />
                <ECPayButton onLoading={setIsLoading} />
              </div>
            </div>

            <div className="payment-section">
              <h3>Convenience Store Payment</h3>
              <div className="store-options">
                <ConvenienceStoreButton
                  storeType="7_ELEVEN"
                  storeName="7-ELEVEN"
                  logoSrc="/images/7-11-logo.png"
                  onLoading={setIsLoading}
                />
                <ConvenienceStoreButton
                  storeType="FAMILY_MART"
                  storeName="Family Mart"
                  logoSrc="/images/family-mart-logo.png"
                  onLoading={setIsLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}