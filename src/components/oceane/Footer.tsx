import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const Footer = () => {
  const { t } = useLocale();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-serif font-bold">DP</span>
              </div>
              <span className="font-serif font-bold text-xl">DEESSE PEARLS</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">{t('nav.collections')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-secondary transition-colors">{t('category.Colliers')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('category.Bagues')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t("category.Boucles d'oreilles")}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('category.Bracelets')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Papeete, Tahiti<br />Polynésie Française</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+689 40 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@deessepearls.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">{t('newsletter.tagline')}</h4>
            <p className="text-primary-foreground/70 text-sm mb-4">{t('newsletter.description')}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border-0 rounded-l-full text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-r-full font-medium text-sm hover:bg-secondary/90 transition-colors">
                {t('newsletter.cta')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>&copy; 2024 DEESSE PEARLS RENAISSANCE. {t('footer.rights')}.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-secondary transition-colors">{t('footer.legal')}</a>
              <a href="#" className="hover:text-secondary transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-secondary transition-colors">{t('footer.cgv')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;