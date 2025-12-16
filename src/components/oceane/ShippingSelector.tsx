import { useState, useEffect } from 'react';
import { Check, Truck, MapPin, User, Building, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { 
  ShippingCarrier, 
  getZoneFromCountry,
  calculateCarrierShippingCost,
  getAvailableCarriers,
  isTahitiOrMoorea
} from '@/types/shippingCarriers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ShippingSelectorProps {
  orderTotal: number;
  onShippingSelect: (carrier: ShippingCarrier | null, cost: number) => void;
  selectedCarrierId?: string;
}

const ShippingSelector = ({ orderTotal, onShippingSelect, selectedCarrierId }: ShippingSelectorProps) => {
  const { formatPrice, t, countryCode } = useLocale();
  const { shippingCountryCode, shippingCity } = useUserProfile();
  
  // Use profile shipping country/city if set, otherwise fallback to detected country
  const [destinationCountry, setDestinationCountry] = useState(
    shippingCountryCode || countryCode || 'FR'
  );
  const [destinationCity, setDestinationCity] = useState(shippingCity || '');
  
  // Update when profile shipping address changes
  useEffect(() => {
    if (shippingCountryCode) {
      setDestinationCountry(shippingCountryCode);
    }
    if (shippingCity) {
      setDestinationCity(shippingCity);
    }
  }, [shippingCountryCode, shippingCity]);
  
  const zone = getZoneFromCountry(destinationCountry);
  const availableCarriers = getAvailableCarriers(destinationCountry, destinationCity);
  const isFreeLocalDelivery = destinationCountry === 'PF' && isTahitiOrMoorea(destinationCity);

  // Auto-select free delivery for Tahiti/Moorea
  useEffect(() => {
    if (isFreeLocalDelivery) {
      onShippingSelect(null, 0);
    }
  }, [isFreeLocalDelivery, onShippingSelect]);
  
  const countries = [
    { code: 'PF', name: 'Polynésie Française' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'ES', name: 'Espagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'PT', name: 'Portugal' },
    { code: 'AT', name: 'Autriche' },
    { code: 'US', name: 'États-Unis' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australie' },
    { code: 'NZ', name: 'Nouvelle-Zélande' },
    { code: 'JP', name: 'Japon' },
    { code: 'CN', name: 'Chine' },
    { code: 'KR', name: 'Corée du Sud' },
    { code: 'SG', name: 'Singapour' },
    { code: 'OTHER', name: t('cart.otherCountry') },
  ];

  const handleCountryChange = (code: string) => {
    setDestinationCountry(code === 'OTHER' ? 'XX' : code);
  };

  const handleCarrierSelect = (carrier: ShippingCarrier) => {
    const { cost } = calculateCarrierShippingCost(carrier, zone, orderTotal, destinationCountry, destinationCity);
    onShippingSelect(carrier, cost);
  };

  return (
    <div className="space-y-4">
      {/* Profile shipping address indicator */}
      {shippingCountryCode && shippingCity && (
        <div className="bg-primary/10 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <User className="w-4 h-4" />
            <span>{t('cart.usingProfileAddress')}</span>
          </div>
          <Link to="/profile" className="text-xs text-primary hover:underline">
            {t('cart.editProfile')}
          </Link>
        </div>
      )}
      
      {/* City input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Building className="w-4 h-4" />
          {t('cart.city')}
        </label>
        <Input
          value={destinationCity}
          onChange={(e) => setDestinationCity(e.target.value)}
          placeholder={t('cart.cityPlaceholder')}
          className="bg-background border-border"
        />
      </div>

      {/* Destination selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="w-4 h-4" />
          {t('cart.destination')}
        </label>
        <Select value={destinationCountry === 'XX' ? 'OTHER' : destinationCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full bg-background border-border">
            <SelectValue placeholder={t('cart.selectCountry')} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Free delivery message for Tahiti/Moorea */}
      {isFreeLocalDelivery && destinationCity && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center gap-3">
          <Gift className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-400">
              {t('cart.freeLocalDelivery')}
            </p>
            <p className="text-sm text-green-600 dark:text-green-500">
              Tahiti & Moorea
            </p>
          </div>
        </div>
      )}

      {/* Carriers list */}
      {!isFreeLocalDelivery && availableCarriers.length > 0 && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Truck className="w-4 h-4" />
            {t('cart.selectCarrier')}
          </label>
          <div className="space-y-2">
            {availableCarriers.map((carrier) => {
              const { cost } = calculateCarrierShippingCost(carrier, zone, orderTotal, destinationCountry, destinationCity);
              const isSelected = selectedCarrierId === carrier.id;
              const deliveryDays = carrier.deliveryDays[zone];
              
              return (
                <button
                  key={carrier.id}
                  onClick={() => handleCarrierSelect(carrier)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    isSelected 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                      : 'border-border hover:border-primary/50 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{carrier.logo}</span>
                      <div>
                        <p className="font-medium text-foreground">{carrier.name}</p>
                        {deliveryDays && (
                          <p className="text-xs text-muted-foreground">
                            {deliveryDays} {t('cart.days')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {formatPrice(cost)}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No city entered for Polynesia */}
      {destinationCountry === 'PF' && !destinationCity && (
        <p className="text-sm text-muted-foreground italic">
          {t('cart.enterCityForShipping')}
        </p>
      )}
    </div>
  );
};

export default ShippingSelector;
