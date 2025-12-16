import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Hero = () => {
  const { t } = useLocale();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main hero banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-brand-green-dark p-8 md:p-12 text-primary-foreground min-h-[400px] flex flex-col justify-center">
            <div className="relative z-10 max-w-md">
              <p className="text-secondary font-medium mb-2">{t('hero.tagline')}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {t('hero.title')}
                <br />
                <span className="text-secondary">{t('hero.titleAccent')}</span>
              </h1>
              <p className="text-primary-foreground/80 mb-6 text-lg">
                {t('hero.description')}
              </p>
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8"
                asChild
              >
                <a href="#collections">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t('hero.cta')}
                </a>
              </Button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-primary-foreground/10 rounded-full" />
            <div className="absolute bottom-10 right-20 w-16 h-16 bg-secondary/20 rounded-full" />
          </div>

          {/* Side promo card */}
          <div className="relative rounded-2xl overflow-hidden min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
              alt="Perles de Tahiti"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">
                {t('promo.badge')}
              </span>
              <h2 className="font-serif text-3xl font-bold mb-2">{t('promo.title')}</h2>
              <p className="text-white/80 mb-4">{t('promo.subtitle')}</p>
              <a
                href="#collections"
                className="inline-flex items-center text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                {t('promo.cta')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;