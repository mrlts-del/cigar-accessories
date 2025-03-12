'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import { products } from '../data/products'

export default function ProductSection() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <section id="products" className="container">
      <div className="urgency-banner">
        Limited stock available - Order now while supplies last
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}