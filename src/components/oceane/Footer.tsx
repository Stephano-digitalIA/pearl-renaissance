import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const Footer = () => {
  const { t } = useLocale();

  return (
    <footer className="bg-ocean-dark text-primary-foreground pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="text-2xl font-serif font-bold tracking-widest mb-6">DEESSEDIAMS RENAISSANCE</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            L'essence pure de la Polynésie. Des bijoux créés avec passion, authenticité et respect de la nature.
          </p>
          <div className="flex space-x-4">
            <Instagram className="w-5 h-5 text-gray-400 hover:text-primary-foreground cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-gray-400 hover:text-primary-foreground cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-gray-400 hover:text-primary-foreground cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-6">{t('nav.collections')}</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-sand-gold transition-colors">Colliers</a></li>
            <li><a href="#" className="hover:text-sand-gold transition-colors">Bagues</a></li>
            <li><a href="#" className="hover:text-sand-gold transition-colors">Boucles d'oreilles</a></li>
            <li><a href="#" className="hover:text-sand-gold transition-colors">Haute Joaillerie</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">{t('footer.contact')}</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-sand-gold transition-colors">{t('footer.contact')}</a></li>
            <li><a href="#" className="hover:text-sand-gold transition-colors">{t('shipping.worldwide')}</a></li>
            <li><a href="#" className="hover:text-sand-gold transition-colors">{t('footer.legal')}</a></li>
            <li><a href="#" className="hover:text-sand-gold transition-colors">{t('footer.privacy')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">{t('newsletter.tagline')}</h4>
          <p className="text-gray-400 text-sm mb-4">{t('newsletter.description')}</p>
          <div className="flex border-b border-gray-600 pb-2">
            <input 
              type="email" 
              placeholder={t('newsletter.placeholder')} 
              className="bg-transparent w-full outline-none text-primary-foreground placeholder-gray-500 text-sm" 
            />
            <button className="text-sand-gold hover:text-primary-foreground uppercase text-xs font-bold tracking-widest">
              {t('newsletter.cta')}
            </button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-600 text-xs">
        &copy; 2024 DEESSEDIAMS RENAISSANCE. {t('footer.rights')}.
      </div>
    </footer>
  );
};

export default Footer;
