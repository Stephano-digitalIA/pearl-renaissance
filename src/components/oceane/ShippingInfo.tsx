import { Truck, Clock, Shield, MapPin } from 'lucide-react';
import { shippingZones, ShippingZone, calculateShippingCost } from '@/types/geolocation';
import { useGeolocation } from '@/hooks/useGeolocation';

const ShippingInfo = () => {
  const { location } = useGeolocation();

  return (
    <section id="atelier" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-ocean-teal uppercase tracking-[0.2em] text-sm font-semibold">
            Livraison Mondiale
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 text-foreground">
            Nos Zones de Livraison
          </h2>
          <div className="w-20 h-0.5 bg-sand-gold mx-auto mt-6"></div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-ocean-teal/10 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-ocean-teal" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-foreground">Livraison Sécurisée</h3>
            <p className="text-muted-foreground text-sm">
              Tous nos bijoux sont expédiés dans un écrin de luxe, assurés et suivis.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-sand-gold/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-sand-gold" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-foreground">Garantie Authenticité</h3>
            <p className="text-muted-foreground text-sm">
              Certificat d'authenticité inclus avec chaque perle de Tahiti.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-ocean-teal/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-ocean-teal" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-foreground">Retours Gratuits</h3>
            <p className="text-muted-foreground text-sm">
              30 jours pour retourner votre commande sans frais.
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
                  <th className="px-6 py-4 text-center font-serif text-lg">Frais de base</th>
                  <th className="px-6 py-4 text-center font-serif text-lg">Délai estimé</th>
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
                              Votre zone
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-semibold ${zone.baseCost === 0 ? 'text-ocean-teal' : 'text-foreground'}`}>
                          {zone.baseCost === 0 ? 'Gratuit' : `${calculateShippingCost(zone)}€`}
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
          * Les frais peuvent varier selon le poids et les dimensions du colis. Livraison gratuite en Polynésie Française.
        </p>
      </div>
    </section>
  );
};

export default ShippingInfo;
