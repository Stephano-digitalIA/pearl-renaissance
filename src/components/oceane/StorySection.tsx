import { useLocale } from '@/contexts/LocaleContext';

const StorySection = () => {
  const { t } = useLocale();

  return (
    <section id="histoire" className="py-24 bg-ocean-dark text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative">
          <div className="absolute -top-10 -left-10 w-24 h-24 border-t-2 border-l-2 border-sand-gold opacity-50"></div>
          <img 
            src="https://images.unsplash.com/photo-1576495149368-0d195f1909a3?q=80&w=1000&auto=format&fit=crop" 
            alt="Pearl Harvesting" 
            className="w-full h-[500px] object-cover filter brightness-75 hover:brightness-100 transition-all duration-500"
          />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 border-b-2 border-r-2 border-sand-gold opacity-50"></div>
        </div>
        <div className="order-1 md:order-2">
          <span className="text-sand-gold uppercase tracking-[0.2em] text-sm mb-4 block">{t('story.tagline')}</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            {t('story.title')}
          </h2>
          <p className="text-gray-400 font-light leading-relaxed mb-6">
            {t('story.p1')}
          </p>
          <p className="text-gray-400 font-light leading-relaxed mb-8">
            {t('story.p2')}
          </p>
          <a 
            href="#" 
            className="text-sand-gold uppercase tracking-widest text-xs border-b border-sand-gold pb-1 hover:text-primary-foreground hover:border-primary-foreground transition-colors"
          >
            {t('story.cta')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
