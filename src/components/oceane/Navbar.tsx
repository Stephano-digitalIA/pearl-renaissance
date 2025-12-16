import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
}

const Navbar = ({ cartCount, setIsCartOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLocale();

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
          <a href="#collections" className="hover:text-sand-gold transition-colors">{t('nav.collections')}</a>
          <a href="#histoire" className="hover:text-sand-gold transition-colors">{t('nav.story')}</a>
          <a href="#atelier" className="hover:text-sand-gold transition-colors">{t('nav.workshop')}</a>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Search className="w-5 h-5 cursor-pointer hover:text-sand-gold transition-colors hidden sm:block" />
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
            <a href="#collections" onClick={() => setMobileMenuOpen(false)}>{t('nav.collections')}</a>
            <a href="#histoire" onClick={() => setMobileMenuOpen(false)}>{t('nav.story')}</a>
            <a href="#atelier" onClick={() => setMobileMenuOpen(false)}>{t('nav.workshop')}</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
