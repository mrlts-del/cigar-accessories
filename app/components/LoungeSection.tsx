'use client'

import { useEffect, useRef } from 'react'

export default function LoungeSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video play failed:", error);
      });

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && videoRef.current) {
          videoRef.current.play().catch(error => {
            console.log("Video play failed:", error);
          });
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, []);

  return (
    <section className="lounge">
      <div className="video-background">
        <video 
          ref={videoRef}
          className="lounge-video"
          autoPlay 
          muted 
          playsInline 
          preload="auto"
          poster="https://res.cloudinary.com/dvumjbuwj/video/upload/v1741597902/LoungePromo_nadgsz.jpg"
        >
          <source 
            src="https://res.cloudinary.com/dvumjbuwj/video/upload/v1741597902/LoungePromo_nadgsz.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>
      
      <div className="container">
        <h2>Experience Our Exclusive Lounge - Opening 2026</h2>
        
        <ul className="benefits-list">
          <li>
            Our premium venue will offer a sophisticated haven where aficionados,
            cocktail enthusiasts, and culinary explorers converge for a holistic
            sensory journey.
          </li>
          <li>
            Immerse yourself in our meticulously curated pairing menus,
            where each dish harmonizes with premium beverages to create
            transcendent flavor experiences.
          </li>
        </ul>
        
        <div className="line-group">
          <h3>Join Our LINE Community</h3>
          <p>Scan this QR code</p>
          <div className="qr-code"></div>
          <p>
            Connect with fellow enthusiasts and receive early access<br />
            to curated events and special offers
          </p>
        </div>
      </div>
    </section>
  )
}