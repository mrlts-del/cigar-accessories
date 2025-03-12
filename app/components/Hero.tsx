'use client'

export default function Hero() {
  return (
    <section className="hero">
      <div className="video-background">
        <video 
          autoPlay 
          muted 
          playsInline 
          preload="auto"
          poster="https://res.cloudinary.com/dvumjbuwj/video/upload/v1741597553/SmokeBackground_emdqlg.jpg"
        >
          <source src="https://res.cloudinary.com/dvumjbuwj/video/upload/v1741597553/SmokeBackground_emdqlg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        <h1>Premium Cigar Accessories for the Discerning Enthusiast</h1>
        <p>Elevate your cigar experience with our luxury collection</p>
        <a href="#products" className="primary-cta">Explore Collection</a>
      </div>
    </section>
  )
}