'use client'

import Image from 'next/image'
import { Product } from '../data/products'
import { useCartStore } from '../store/cartStore'

interface CartItemProps {
  item: Product & { quantity: number }
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value)
    if (newQuantity === 0) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="cart-item">
      <Image 
        src={item.image}
        alt={item.title}
        width={100}
        height={100}
        className="cart-item-image"
      />
      
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>

      <div className="cart-item-controls">
        <select 
          value={item.quantity} 
          onChange={handleQuantityChange}
          className="quantity-select"
        >
          <option value={0}>Remove</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <p className="cart-item-total">
          ${(item.price * item.quantity).toFixed(2)}
        </p>

        <button 
          onClick={() => removeItem(item.id)}
          className="remove-item"
          aria-label="Remove item"
        >
          ✕
        </button>
      </div>
    </div>
  )
}