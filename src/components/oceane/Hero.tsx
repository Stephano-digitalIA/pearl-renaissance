import { useLocale } from '@/contexts/LocaleContext';

const Hero = () => {
  const { t } = useLocale();

  return (
    <section className="relative h-screen flex items-center justify-center text-center hero-bg">
      <div className="relative z-10 px-6 max-w-4xl animate-fade-in">
        <p className="text-sand-gold uppercase tracking-[0.2em] mb-4 text-sm md:text-base font-medium">
          {t('hero.tagline')}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6 leading-tight">
          {t('hero.title')} <br/> 
          <span className="italic font-light">{t('hero.titleAccent')}</span>
        </h1>
        <p className="text-gray-200 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
          {t('hero.description')}
        </p>
        <a 
          href="#collections" 
          className="inline-block bg-primary-foreground text-foreground px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-sand-gold hover:text-primary-foreground transition-all duration-300"
        >
          {t('hero.cta')}
        </a>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-primary-foreground opacity-70">
        <div className="w-[1px] h-16 bg-primary-foreground mx-auto mb-2"></div>
        <span className="text-xs uppercase tracking-widest">{t('hero.discover')}</span>
      </div>
    </section>
  );
};

export default Hero;
