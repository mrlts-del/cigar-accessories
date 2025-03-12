'use client'

import { Montserrat } from 'next/font/google'
import './globals.css'
import { useEffect } from 'react'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '600', '700']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Remove Grammarly or other extension attributes if they exist
    const body = document.querySelector('body');
    if (body) {
      body.removeAttribute('data-new-gr-c-s-check-loaded');
      body.removeAttribute('data-gr-ext-installed');
    }
  }, []);

  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}