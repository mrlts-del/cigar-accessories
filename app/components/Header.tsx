'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '../store/cartStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const totalItems = useCartStore(state => state.totalItems)

  return (
    <header className="header-wrapper">
      <nav className="container">
        <div className="logo">DEFY ORDINARY</div>
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/">Home</Link>
          <Link href="/collection">Collection</Link>
          <Link href="/cigar-lounge">Cigar Lounge</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
          <div className="cart-icon">
            🛒
            <span className="cart-count">{totalItems}</span>
          </div>
        </div>
      </nav>
    </header>
  )
}