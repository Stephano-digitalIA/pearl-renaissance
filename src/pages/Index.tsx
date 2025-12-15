import { useState } from 'react';
import Navbar from '@/components/oceane/Navbar';
import Hero from '@/components/oceane/Hero';
import ProductCard from '@/components/oceane/ProductCard';
import StorySection from '@/components/oceane/StorySection';
import CartDrawer from '@/components/oceane/CartDrawer';
import Testimonials from '@/components/oceane/Testimonials';
import NewsletterCTA from '@/components/oceane/NewsletterCTA';
import Footer from '@/components/oceane/Footer';
import { products, testimonials, categories } from '@/data/oceaneData';
import { Product } from '@/types/oceane';

const Index = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredProducts = activeCategory === 'Tous' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cart.length} setIsCartOpen={setIsCartOpen} />
      <CartDrawer 
        isOpen={isCartOpen} 
        closeCart={() => setIsCartOpen(false)} 
        cartItems={cart}
        removeFromCart={removeFromCart}
      />
      
      <Hero />

      <main>
        {/* Section Collections */}
        <section id="collections" className="py-20 md:py-32 container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-ocean-teal uppercase tracking-[0.2em] text-sm font-semibold">
              Nos Créations
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 text-foreground">Les Collections</h2>
            <div className="w-20 h-0.5 bg-sand-gold mx-auto mt-6"></div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm uppercase tracking-widest pb-2 border-b-2 transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'border-foreground text-foreground font-medium' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        <StorySection />
        <Testimonials testimonials={testimonials} />
        <NewsletterCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
