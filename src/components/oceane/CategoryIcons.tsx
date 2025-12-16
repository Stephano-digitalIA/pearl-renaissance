import { useLocale } from '@/contexts/LocaleContext';

interface Category {
  id: string;
  label: string;
  image: string;
}

const categories: Category[] = [
  {
    id: "Boucles d'oreilles",
    label: "Boucles d'oreilles",
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'Colliers',
    label: 'Colliers',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'Bagues',
    label: 'Bagues',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'Bracelets',
    label: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
  },
];

interface CategoryIconsProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
}

export const CategoryIcons = ({ onCategorySelect, activeCategory }: CategoryIconsProps) => {
  const { t } = useLocale();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-20">
          {/* All category */}
          <button
            onClick={() => onCategorySelect('Tous')}
            className="flex flex-col items-center gap-4 group"
          >
            <div
              className={`w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                activeCategory === 'Tous'
                  ? 'bg-primary text-primary-foreground scale-105 shadow-primary/30'
                  : 'bg-card border-2 border-primary/30 hover:border-primary hover:scale-105 hover:shadow-xl'
              }`}
            >
              <span className={`text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110 ${
                activeCategory === 'Tous' ? 'text-primary-foreground' : 'text-primary'
              }`}>✦</span>
            </div>
            <span
              className={`text-sm md:text-base font-medium tracking-wide transition-colors duration-300 ${
                activeCategory === 'Tous' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              }`}
            >
              {t('collections.all')}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="flex flex-col items-center gap-4 group"
            >
              <div
                className={`w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden transition-all duration-500 shadow-lg ${
                  activeCategory === cat.id
                    ? 'ring-4 ring-primary ring-offset-4 ring-offset-background scale-105 shadow-primary/30'
                    : 'border-2 border-muted hover:border-primary hover:scale-105 hover:shadow-xl'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span
                className={`text-sm md:text-base font-medium tracking-wide transition-colors duration-300 ${
                  activeCategory === cat.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                }`}
              >
                {t(`category.${cat.label}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;