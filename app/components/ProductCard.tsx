'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '../data/products'
import { useCartStore } from '../store/cartStore'

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="product-card">
      <Image 
        src={product.image}
        alt={product.title}
        width={200}
        height={200}
        className="product-image"
        loading="lazy"
      />
      <div className="product-content">
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
        <button 
          className="add-to-cart"
          onClick={handleAddToCart}
        >
          {isAdded ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}