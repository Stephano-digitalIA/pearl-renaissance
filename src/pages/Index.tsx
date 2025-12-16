import { useState } from 'react';
import Navbar from '@/components/oceane/Navbar';
import Hero from '@/components/oceane/Hero';
import CategoryIcons from '@/components/oceane/CategoryIcons';
import ProductCard from '@/components/oceane/ProductCard';
import StorySection from '@/components/oceane/StorySection';
import CartDrawer from '@/components/oceane/CartDrawer';
import Testimonials from '@/components/oceane/Testimonials';
import NewsletterCTA from '@/components/oceane/NewsletterCTA';
import Footer from '@/components/oceane/Footer';
import LocationBanner from '@/components/oceane/LocationBanner';

import { ProductManager } from '@/components/oceane/ProductManager';
import { useProducts } from '@/hooks/useProducts';
import { useLocale } from '@/contexts/LocaleContext';
import { testimonials } from '@/data/oceaneData';
import { Product } from '@/types/oceane';
import { Button } from '@/components/ui/button';
import { Settings, ArrowRight } from 'lucide-react';

const Index = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsStorage } = useProducts();
  const { t } = useLocale();
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar cartCount={cart.length} setIsCartOpen={setIsCartOpen} />
      <CartDrawer 
        isOpen={isCartOpen} 
        closeCart={() => setIsCartOpen(false)} 
        cartItems={cart}
        removeFromCart={removeFromCart}
      />
      
      <Hero />
      <CategoryIcons onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
      <LocationBanner />

      <main className="flex-1">
        {/* Section Collections */}
        <section id="collections" className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              {t('collections.newProducts')}
            </h2>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsManagerOpen(true)}
                title="Gérer le catalogue"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <a 
                href="#" 
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
              >
                {t('collections.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      <ProductManager
        open={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        products={products}
        addProduct={addProduct}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        resetProductsStorage={resetProductsStorage}
      />
    </div>
  );
};

export default Index;