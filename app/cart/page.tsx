'use client'

import { useCartStore } from '../store/cartStore'
import CartItem from '../components/CartItem'
import Link from 'next/link'

export default function CartPage() {
  const { items, totalItems } = useCartStore()
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link href="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({totalItems} items)</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="checkout-button">
            Proceed to Checkout
          </button>

          <p className="shipping-note">
            {subtotal < 100 && 
              `Add $${(100 - subtotal).toFixed(2)} more for free shipping`
            }
          </p>
        </div>
      </div>
    </div>
  )
}