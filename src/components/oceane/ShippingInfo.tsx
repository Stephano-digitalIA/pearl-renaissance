import { Truck, Clock, Shield, MapPin } from 'lucide-react';
import { shippingZones, calculateShippingCost } from '@/types/geolocation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocale } from '@/contexts/LocaleContext';

const ShippingInfo = () => {
  const { location } = useGeolocation();
  const { t, formatPrice, locale } = useLocale();

  return (
    <section id="atelier" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-ocean-teal uppercase tracking-[0.2em] text-sm font-semibold">
            {t('shipping.worldwide')}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 text-foreground">
            {t('shipping.title')}
          </h2>
          <div className="w-20 h-0.5 bg-sand-gold mx-auto mt-6"></div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-ocean-teal/10 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-ocean-teal" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-foreground">{t('shipping.worldwide')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('shipping.worldwideDesc')}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-sand-gold/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-sand-gold" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-foreground">{t('shipping.certificate')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('shipping.certificateDesc')}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-ocean-teal/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-ocean-teal" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-foreground">{t('shipping.packaging')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('shipping.packagingDesc')}
            </p>
          </div>
        </div>

        {/* Shipping Zones Table */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ocean-dark text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-serif text-lg">Zone</th>
                  <th className="px-6 py-4 text-center font-serif text-lg">{locale === 'en' ? 'Base fee' : 'Frais de base'}</th>
                  <th className="px-6 py-4 text-center font-serif text-lg">{locale === 'en' ? 'Est. delivery' : 'Délai estimé'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shippingZones.map((zone) => {
                  const isCurrentZone = location?.country && 
                    zone.countries.some(c => c.toLowerCase() === location.country?.toLowerCase());
                  
                  return (
                    <tr 
                      key={zone.id} 
                      className={`transition-colors ${isCurrentZone ? 'bg-ocean-teal/10' : 'hover:bg-muted/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isCurrentZone && <MapPin className="w-4 h-4 text-ocean-teal" />}
                          <span className={`font-medium ${isCurrentZone ? 'text-ocean-teal' : 'text-foreground'}`}>
                            {zone.name}
                          </span>
                          {isCurrentZone && (
                            <span className="text-xs bg-ocean-teal text-primary-foreground px-2 py-0.5 rounded-full">
                              {locale === 'en' ? 'Your zone' : 'Votre zone'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-semibold ${zone.baseCost === 0 ? 'text-ocean-teal' : 'text-foreground'}`}>
                          {zone.baseCost === 0 ? (locale === 'en' ? 'Free' : 'Gratuit') : formatPrice(calculateShippingCost(zone) * 119.33)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">
                        {zone.estimatedDays}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {locale === 'en' 
            ? '* Fees may vary depending on weight and dimensions. Free shipping in French Polynesia.'
            : '* Les frais peuvent varier selon le poids et les dimensions du colis. Livraison gratuite en Polynésie Française.'}
        </p>
      </div>
    </section>
  );
};

export default ShippingInfo;
