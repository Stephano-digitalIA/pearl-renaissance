import { useState } from 'react';
import { ShoppingBag, Search, User, Menu, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
}

const categories = [
  { id: 'colliers', label: 'Colliers' },
  { id: 'boucles', label: "Boucles d'oreilles" },
  { id: 'bracelets', label: 'Bracelets' },
  { id: 'bagues', label: 'Bagues' },
];

const Navbar = ({ cartCount, setIsCartOpen }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-sm">DP</span>
            </div>
            <span className="font-serif font-bold text-lg text-foreground hidden sm:block">
              DEESSE PEARLS
            </span>
          </a>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('nav.search')}
                className="w-full pl-10 pr-4 bg-muted border-0 rounded-full"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 hover:bg-muted rounded-full"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">{t('nav.account')}</span>
            </Link>

            <button
              className="relative p-2 hover:bg-muted rounded-full flex items-center gap-2"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('nav.search')}
                className="w-full pl-10 pr-4 bg-muted border-0 rounded-full"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center gap-8 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 font-medium hover:text-secondary transition-colors">
                <Menu className="w-4 h-4" />
                {t('nav.categories')}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} className="cursor-pointer">
                    {t(`category.${cat.label}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="#" className="hover:text-secondary transition-colors">{t('nav.home')}</a>
            <a href="#collections" className="hover:text-secondary transition-colors">{t('nav.shop')}</a>
            <a href="#histoire" className="hover:text-secondary transition-colors">{t('nav.story')}</a>
            <a href="#atelier" className="hover:text-secondary transition-colors">{t('nav.workshop')}</a>
            <a href="#contact" className="ml-auto hover:text-secondary transition-colors">{t('nav.contact')}</a>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {t('nav.categories')}
              </p>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(`category.${cat.label}`)}
                </a>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <a href="#" className="block py-2 hover:text-primary transition-colors">{t('nav.home')}</a>
              <a href="#collections" className="block py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.shop')}</a>
              <a href="#histoire" className="block py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.story')}</a>
              <a href="#atelier" className="block py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t('nav.workshop')}</a>
              <a href="#contact" className="block py-2 hover:text-primary transition-colors">{t('nav.contact')}</a>
            </div>
            <div className="border-t border-border pt-4">
              <Link to="/profile" className="flex items-center gap-2 py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <User className="w-5 h-5" />
                {t('nav.account')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;