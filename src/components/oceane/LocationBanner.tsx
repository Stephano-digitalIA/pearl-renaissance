import { useState, useEffect } from 'react';
import { MapPin, Truck, Loader2, AlertCircle, Database } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getShippingZone, calculateShippingCost } from '@/types/geolocation';
import { getGoogleSheetsWebhook, saveLocationToGoogleSheets } from '@/services/googleSheetsService';
import GoogleSheetsSetup from './GoogleSheetsSetup';
import { useToast } from '@/hooks/use-toast';

const LocationBanner = () => {
  const { location, loading, error, requestLocation } = useGeolocation();
  const [showSetup, setShowSetup] = useState(false);
  const [hasWebhook, setHasWebhook] = useState(false);
  const { toast } = useToast();
  
  const shippingZone = location?.country ? getShippingZone(location.country) : null;
  const shippingCost = shippingZone ? calculateShippingCost(shippingZone) : null;

  // Check for webhook and save location when available
  useEffect(() => {
    const webhookUrl = getGoogleSheetsWebhook();
    setHasWebhook(!!webhookUrl);

    if (location && webhookUrl) {
      saveLocationToGoogleSheets(location, webhookUrl).then((success) => {
        if (success) {
          console.log('Location saved to Google Sheets');
        }
      });
    }
  }, [location]);

  if (!location && !loading && !error) {
    return (
      <>
        <div className="bg-ocean-teal/10 border-b border-ocean-teal/20">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={requestLocation}
                className="flex items-center justify-center gap-2 text-sm text-ocean-teal hover:text-ocean-dark transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Activer la géolocalisation pour estimer vos frais de livraison</span>
              </button>
              <button
                onClick={() => setShowSetup(true)}
                className={`p-1.5 rounded-full transition-colors ${
                  hasWebhook 
                    ? 'bg-ocean-teal/20 text-ocean-teal' 
                    : 'bg-muted text-muted-foreground hover:text-ocean-teal'
                }`}
                title="Configuration Google Sheets"
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <GoogleSheetsSetup isOpen={showSetup} onClose={() => setShowSetup(false)} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="bg-ocean-teal/10 border-b border-ocean-teal/20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-ocean-teal">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Localisation en cours...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
              <button
                onClick={requestLocation}
                className="underline hover:no-underline ml-2"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
        <GoogleSheetsSetup isOpen={showSetup} onClose={() => setShowSetup(false)} />
      </>
    );
  }

  if (location && shippingZone) {
    return (
      <>
        <div className="bg-ocean-teal/10 border-b border-ocean-teal/20">
          <div className="container mx-auto px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-ocean-teal" />
                <span>
                  {location.city && `${location.city}, `}
                  {location.country}
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-ocean-teal/30"></div>
              <div className="flex items-center gap-2 text-foreground">
                <Truck className="w-4 h-4 text-sand-gold" />
                <span>
                  Livraison : <strong className="text-ocean-teal">{shippingCost === 0 ? 'Gratuite' : `${shippingCost}€`}</strong>
                  <span className="text-muted-foreground ml-1">({shippingZone.estimatedDays})</span>
                </span>
              </div>
              <button
                onClick={() => setShowSetup(true)}
                className={`p-1.5 rounded-full transition-colors ${
                  hasWebhook 
                    ? 'bg-ocean-teal/20 text-ocean-teal' 
                    : 'bg-muted text-muted-foreground hover:text-ocean-teal'
                }`}
                title="Configuration Google Sheets"
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <GoogleSheetsSetup isOpen={showSetup} onClose={() => setShowSetup(false)} />
      </>
    );
  }

  return null;
};

export default LocationBanner;
