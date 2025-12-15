import { useState, useEffect, useCallback } from 'react';
import { GeoLocation } from '@/types/geolocation';

interface UseGeolocationReturn {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lon: number): Promise<Partial<GeoLocation>> => {
    try {
      // Using free Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr',
          }
        }
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village || data.address?.municipality,
        country: data.address?.country,
        region: data.address?.state || data.address?.region,
      };
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return {};
    }
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        const addressInfo = await reverseGeocode(latitude, longitude);
        
        setLocation({
          latitude,
          longitude,
          ...addressInfo,
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Erreur de géolocalisation';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Vous avez refusé l\'accès à votre position';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible';
            break;
          case err.TIMEOUT:
            errorMessage = 'La requête a expiré';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  return { location, loading, error, requestLocation };
};
