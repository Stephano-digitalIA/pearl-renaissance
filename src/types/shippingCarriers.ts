export interface ShippingCarrier {
  id: string;
  name: string;
  logo: string;
  baseRates: {
    local: number;      // Polynésie
    pacific: number;    // Pacifique
    europe: number;     // Europe
    northamerica: number; // Amérique du Nord
    asia: number;       // Asie
    world: number;      // Reste du monde
  };
  deliveryDays: {
    local: string;
    pacific: string;
    europe: string;
    northamerica: string;
    asia: string;
    world: string;
  };
  freeShippingThreshold: number; // Montant en XPF pour livraison gratuite
}

export const shippingCarriers: ShippingCarrier[] = [
  {
    id: 'colissimo',
    name: 'Colissimo',
    logo: '📦',
    baseRates: {
      local: 800,
      pacific: 3500,
      europe: 2500,
      northamerica: 4000,
      asia: 3800,
      world: 5000
    },
    deliveryDays: {
      local: '2-3',
      pacific: '7-10',
      europe: '5-7',
      northamerica: '7-10',
      asia: '7-12',
      world: '10-15'
    },
    freeShippingThreshold: 50000 // ~420€
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    logo: '🚀',
    baseRates: {
      local: 1500,
      pacific: 5000,
      europe: 4500,
      northamerica: 5500,
      asia: 5000,
      world: 7000
    },
    deliveryDays: {
      local: '1-2',
      pacific: '3-5',
      europe: '2-4',
      northamerica: '3-5',
      asia: '3-5',
      world: '5-7'
    },
    freeShippingThreshold: 80000 // ~670€
  },
  {
    id: 'fedex',
    name: 'FedEx',
    logo: '✈️',
    baseRates: {
      local: 1800,
      pacific: 5500,
      europe: 5000,
      northamerica: 4800,
      asia: 5200,
      world: 7500
    },
    deliveryDays: {
      local: '1-2',
      pacific: '3-5',
      europe: '3-5',
      northamerica: '2-4',
      asia: '3-5',
      world: '5-8'
    },
    freeShippingThreshold: 80000
  },
  {
    id: 'ups',
    name: 'UPS',
    logo: '📬',
    baseRates: {
      local: 1600,
      pacific: 5200,
      europe: 4800,
      northamerica: 4500,
      asia: 5000,
      world: 7200
    },
    deliveryDays: {
      local: '1-2',
      pacific: '4-6',
      europe: '3-5',
      northamerica: '2-4',
      asia: '4-6',
      world: '6-9'
    },
    freeShippingThreshold: 75000
  },
  {
    id: 'chronopost',
    name: 'Chronopost',
    logo: '⚡',
    baseRates: {
      local: 1200,
      pacific: 4200,
      europe: 3500,
      northamerica: 5000,
      asia: 4500,
      world: 6000
    },
    deliveryDays: {
      local: '1',
      pacific: '5-7',
      europe: '2-4',
      northamerica: '5-7',
      asia: '5-7',
      world: '7-10'
    },
    freeShippingThreshold: 60000
  }
];

export type ShippingZoneKey = 'local' | 'pacific' | 'europe' | 'northamerica' | 'asia' | 'world';

export const countryToZone: Record<string, ShippingZoneKey> = {
  // Local - Polynésie Française
  PF: 'local',
  // Pacific
  NZ: 'pacific',
  AU: 'pacific',
  FJ: 'pacific',
  NC: 'pacific',
  // Europe
  FR: 'europe',
  DE: 'europe',
  IT: 'europe',
  ES: 'europe',
  BE: 'europe',
  CH: 'europe',
  NL: 'europe',
  GB: 'europe',
  PT: 'europe',
  AT: 'europe',
  IE: 'europe',
  GR: 'europe',
  FI: 'europe',
  SE: 'europe',
  DK: 'europe',
  NO: 'europe',
  PL: 'europe',
  CZ: 'europe',
  HU: 'europe',
  RO: 'europe',
  BG: 'europe',
  HR: 'europe',
  SK: 'europe',
  SI: 'europe',
  LU: 'europe',
  MC: 'europe',
  // North America
  US: 'northamerica',
  CA: 'northamerica',
  MX: 'northamerica',
  // Asia
  JP: 'asia',
  CN: 'asia',
  KR: 'asia',
  SG: 'asia',
  HK: 'asia',
  TW: 'asia',
};

export const getZoneFromCountry = (countryCode: string): ShippingZoneKey => {
  return countryToZone[countryCode] || 'world';
};

export const calculateCarrierShippingCost = (
  carrier: ShippingCarrier,
  zone: ShippingZoneKey,
  orderTotal: number
): { cost: number; isFree: boolean } => {
  if (orderTotal >= carrier.freeShippingThreshold) {
    return { cost: 0, isFree: true };
  }
  return { cost: carrier.baseRates[zone], isFree: false };
};
