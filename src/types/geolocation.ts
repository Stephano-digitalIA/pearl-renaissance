export interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  region?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  baseCost: number;
  perKgCost: number;
  estimatedDays: string;
}

export const shippingZones: ShippingZone[] = [
  {
    id: 'polynesia',
    name: 'Polynésie Française',
    countries: ['French Polynesia', 'PF'],
    baseCost: 0,
    perKgCost: 0,
    estimatedDays: '1-2 jours'
  },
  {
    id: 'pacific',
    name: 'Pacifique',
    countries: ['New Zealand', 'Australia', 'Fiji', 'New Caledonia', 'NZ', 'AU', 'FJ', 'NC'],
    baseCost: 25,
    perKgCost: 8,
    estimatedDays: '5-7 jours'
  },
  {
    id: 'europe',
    name: 'Europe',
    countries: ['France', 'Germany', 'Italy', 'Spain', 'Belgium', 'Switzerland', 'Netherlands', 'FR', 'DE', 'IT', 'ES', 'BE', 'CH', 'NL', 'United Kingdom', 'GB', 'Portugal', 'PT', 'Austria', 'AT'],
    baseCost: 35,
    perKgCost: 12,
    estimatedDays: '7-10 jours'
  },
  {
    id: 'northamerica',
    name: 'Amérique du Nord',
    countries: ['United States', 'Canada', 'US', 'CA', 'USA'],
    baseCost: 40,
    perKgCost: 15,
    estimatedDays: '7-12 jours'
  },
  {
    id: 'asia',
    name: 'Asie',
    countries: ['Japan', 'China', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan', 'JP', 'CN', 'KR', 'SG', 'HK', 'TW'],
    baseCost: 30,
    perKgCost: 10,
    estimatedDays: '5-8 jours'
  },
  {
    id: 'world',
    name: 'Reste du Monde',
    countries: [],
    baseCost: 50,
    perKgCost: 18,
    estimatedDays: '10-15 jours'
  }
];

export const getShippingZone = (country: string): ShippingZone => {
  const zone = shippingZones.find(z => 
    z.countries.some(c => c.toLowerCase() === country.toLowerCase())
  );
  return zone || shippingZones.find(z => z.id === 'world')!;
};

export const calculateShippingCost = (zone: ShippingZone, weightKg: number = 0.1): number => {
  return zone.baseCost + (zone.perKgCost * weightKg);
};
