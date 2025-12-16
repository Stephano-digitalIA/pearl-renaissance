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
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'Colliers',
    label: 'Colliers',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'Bagues',
    label: 'Bagues',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'Bracelets',
    label: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1602752250055-567f4a72758c?auto=format&fit=crop&q=80&w=200',
  },
];

interface CategoryIconsProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
}

export const CategoryIcons = ({ onCategorySelect, activeCategory }: CategoryIconsProps) => {
  const { t } = useLocale();

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {/* All category */}
          <button
            onClick={() => onCategorySelect('Tous')}
            className="flex flex-col items-center gap-3 group"
          >
            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'Tous'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary bg-background'
              }`}
            >
              <span className="text-2xl">✦</span>
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
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
              className="flex flex-col items-center gap-3 group"
            >
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 overflow-hidden transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-border hover:border-primary'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
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