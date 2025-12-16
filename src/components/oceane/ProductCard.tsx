import { Heart, Info } from 'lucide-react';
import { Product } from '@/types/oceane';
import { useLocale } from '@/contexts/LocaleContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard = ({ product, addToCart }: ProductCardProps) => {
  const { formatPrice, t } = useLocale();

  return (
    <div className="group relative bg-card pb-4 transition-all duration-500 hover:shadow-xl">
      <div className="relative overflow-hidden aspect-[4/5] bg-muted mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:text-destructive">
          <Heart className="w-4 h-4" />
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-0 left-0 w-full bg-ocean-teal text-primary-foreground py-3 uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium"
        >
          {t('collections.addToCart')}
        </button>
      </div>
      <div className="px-4 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {t(`collections.${product.category === 'Colliers' ? 'necklaces' : product.category === "Boucles d'oreilles" ? 'earrings' : product.category === 'Bracelets' ? 'bracelets' : 'rings'}`)}
        </p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="font-serif text-xl text-foreground group-hover:text-sand-gold transition-colors">
            {product.name}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{t(`product.${product.id}.description`) !== `product.${product.id}.description` ? t(`product.${product.id}.description`) : product.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="font-medium text-foreground">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
