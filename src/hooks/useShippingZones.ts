import { useState, useEffect } from 'react';
import { ShippingZone, shippingZones as defaultZones } from '@/types/geolocation';

const STORAGE_KEY = 'oceane_shipping_zones';

export const useShippingZones = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setZones(JSON.parse(stored));
    } else {
      setZones(defaultZones);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultZones));
    }
    setLoading(false);
  }, []);

  const saveZones = (newZones: ShippingZone[]) => {
    setZones(newZones);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newZones));
  };

  const updateZone = (id: string, updates: Partial<ShippingZone>) => {
    const newZones = zones.map(z => 
      z.id === id ? { ...z, ...updates } : z
    );
    saveZones(newZones);
  };

  const resetZones = () => {
    localStorage.removeItem(STORAGE_KEY);
    setZones(defaultZones);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultZones));
  };

  return {
    zones,
    loading,
    updateZone,
    resetZones,
  };
};
