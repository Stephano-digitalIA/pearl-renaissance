import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types/oceane';
import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard = ({ product, addToCart }: ProductCardProps) => {
  const { formatPrice, t } = useLocale();
  const isNew = product.id <= 2; // Mark first 2 products as new

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        {isNew && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            New
          </Badge>
        )}
        
        {/* Wishlist button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background hover:text-destructive">
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick add button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={() => addToCart(product)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            size="sm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {t('collections.addToCart')}
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {t(`category.${product.category}`)}
        </p>
        <h3 className="font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3 h-3 ${i < 4 ? 'fill-secondary text-secondary' : 'text-border'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>

        <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;