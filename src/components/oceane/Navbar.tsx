import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search, Settings } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  onOpenManager: () => void;
}

const Navbar = ({ cartCount, setIsCartOpen, onOpenManager }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-card/95 backdrop-blur-md shadow-sm py-4 text-foreground' 
        : 'bg-transparent py-6 text-primary-foreground'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-serif font-bold tracking-widest cursor-pointer">
          OCÉANE
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm tracking-wide font-medium uppercase">
          <a href="#collections" className="hover:text-sand-gold transition-colors">Collections</a>
          <a href="#histoire" className="hover:text-sand-gold transition-colors">L'Histoire</a>
          <a href="#atelier" className="hover:text-sand-gold transition-colors">L'Atelier</a>
        </div>

        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-sand-gold transition-colors hidden sm:block" />
          <div 
            className="cursor-pointer" 
            onClick={onOpenManager}
            title="Gérer le catalogue"
          >
            <Settings className="w-5 h-5 hover:text-sand-gold transition-colors" />
          </div>
          <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className="w-5 h-5 hover:text-sand-gold transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sand-gold text-accent-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <Menu 
            className="md:hidden w-6 h-6 cursor-pointer" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-card text-foreground shadow-lg py-4 md:hidden animate-fade-in">
          <div className="flex flex-col items-center space-y-4 font-serif text-lg">
            <a href="#collections" onClick={() => setMobileMenuOpen(false)}>Collections</a>
            <a href="#histoire" onClick={() => setMobileMenuOpen(false)}>L'Histoire</a>
            <a href="#atelier" onClick={() => setMobileMenuOpen(false)}>L'Atelier</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
