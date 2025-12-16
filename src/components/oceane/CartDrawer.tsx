import { ShoppingBag, X } from 'lucide-react';
import { Product } from '@/types/oceane';
import { useLocale } from '@/contexts/LocaleContext';

interface CartDrawerProps {
  isOpen: boolean;
  closeCart: () => void;
  cartItems: Product[];
  removeFromCart: (index: number) => void;
}

const CartDrawer = ({ isOpen, closeCart, cartItems, removeFromCart }: CartDrawerProps) => {
  const { formatPrice, t } = useLocale();
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-pearl-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-card z-[70] shadow-2xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}>
        <div className="p-6 flex justify-between items-center border-b border-border">
          <h2 className="font-serif text-2xl text-foreground">{t('cart.title')}</h2>
          <X 
            className="cursor-pointer hover:text-destructive transition-colors text-foreground" 
            onClick={closeCart} 
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground mt-20">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>{t('cart.empty')}</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex space-x-4 animate-fade-in">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover bg-muted" 
                />
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase">{item.category}</p>
                  <p className="font-medium mt-1 text-foreground">{formatPrice(item.price)}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(index)} 
                  className="text-muted-foreground hover:text-destructive self-start"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-border bg-muted">
          <div className="flex justify-between items-center mb-4 text-lg font-serif font-bold text-foreground">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button 
            className="w-full bg-ocean-dark text-primary-foreground py-4 uppercase text-sm tracking-widest hover:bg-ocean-teal transition-colors disabled:opacity-50"
            disabled={cartItems.length === 0}
          >
            {t('cart.checkout')}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
