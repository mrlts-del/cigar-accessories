import Header from './components/Header'
import Hero from './components/Hero'
import TrustSection from './components/TrustSection'
import ProductSection from './components/ProductSection'
import LoungeSection from './components/LoungeSection'
import BlogSection from './components/BlogSection'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustSection />
        <ProductSection />
        <LoungeSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}